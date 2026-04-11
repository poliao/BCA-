import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProcessGroup } from '../sumt03.model';
import { Sumt03Service } from '../sumt03.service';
import { Sumt03GroupModalComponent } from './sumt03-group-modal.component';

@Component({
  selector: 'app-sumt03-group',
  templateUrl: './sumt03-group.component.html'
})
export class Sumt03GroupComponent implements OnInit {
  dataSource = new MatTableDataSource<ProcessGroup>();
  displayedColumns: string[] = ['groupName', 'displayOrder', 'action'];
  actions: any = { create: true, edit: true, delete: true }; // Should come from parent or resolver, but for master data usually same as module

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
    this.su.getGroups().subscribe(groups => {
      this.dataSource.data = groups;
    });
  }

  add() {
    this.edit({});
  }

  edit(row: any) {
    this.dialog.open(Sumt03GroupModalComponent, {
      data: row,
      width: '500px'
    }).afterClosed().subscribe(res => {
      if (res) this.loadData();
    });
  }

  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.su.deleteGroup(row.id))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      this.loadData();
    });
  }
}
