import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Sumt01Service } from './sumt01.service';
import { SuMenu } from './sumt01.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-sumt01',
  templateUrl: './sumt01.component.html'
})
export class Sumt01Component implements OnInit {

  displayedColumns: string[] = ['menuCode', 'menuNameEn', 'menuNameTh', 'url', 'sequence', 'action'];
  dataSource = new MatTableDataSource<SuMenu>([]);
  actions: any;

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
    private modal: ModalService,
    private su: Sumt01Service,
    private ms: MessageService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.sumt01.actions;
    });
    this.loadData();
  }

  loadData() {
    this.su.getMenus().subscribe(menus => {
      this.dataSource.data = menus;
    });
  }

  add() {
    this.router.navigate(['/su/sumt01/detail']);
  }

  remove(row: SuMenu) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.su.delete(row.id))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      this.loadData();
    })
  }
}
