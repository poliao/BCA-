import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductionLocation } from '../sumt03.model';
import { Sumt03Service } from '../sumt03.service';
import { Sumt03LocationModalComponent } from './sumt03-location-modal.component';

@Component({
  selector: 'app-sumt03-location',
  templateUrl: './sumt03-location.component.html'
})
export class Sumt03LocationComponent implements OnInit {
  dataSource = new MatTableDataSource<ProductionLocation>();
  displayedColumns: string[] = ['locationName', 'locationType', 'action'];
  actions: any = { create: true, edit: true, delete: true };

  constructor(
    private su: Sumt03Service,
    private modal: ModalService,
    private ms: MessageService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.su.getLocations().subscribe(locations => {
      this.dataSource.data = locations;
    });
  }

  add() {
    this.edit({});
  }

  edit(row: any) {
    this.dialog.open(Sumt03LocationModalComponent, {
      data: row,
      width: '500px'
    }).afterClosed().subscribe(res => {
      if (res) this.loadData();
    });
  }

  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.su.deleteLocation(row.id))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      this.loadData();
    });
  }
}
