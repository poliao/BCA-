import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Pomt02Service } from './pomt02.service';
import { Pomt02 } from './pomt02.model';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { PageCriteria } from '@app/shared/components/datatable/page';

@Component({
  templateUrl: './pomt02.component.html'
})
export class Pomt02Component implements OnInit {

  displayedColumns: string[] = ['itemCode', 'itemNameTh', 'itemNameEn', 'categoryCode', 'active', 'action'];
  dataSource!: PaginatedDataSource<Pomt02, any>;
  actions: any;

  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private po: Pomt02Service,
    private ms: MessageService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.pomt02.actions;
    });

    this.dataSource = new PaginatedDataSource<Pomt02, any>(
      (request, query) => this.po.getList(Object.assign(query, request), {}),
      new PageCriteria('itemCode')
    );
    this.dataSource.queryBy({});
  }

  add() {
    this.router.navigate(['/po/pomt02/detail']);
  }

  edit(row: Pomt02) {
    this.router.navigate(['/po/pomt02/detail'], { state: { id: row.id } });
  }

  remove(row: Pomt02) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.po.delete(row.id!))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.dataSource.calculatePageAfterDelete();
      this.dataSource.fetch(page);
    });
  }
}