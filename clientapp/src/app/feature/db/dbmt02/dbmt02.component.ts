import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Dbmt02Service } from './dbmt02.service';
import { FormGroup } from '@angular/forms';

@Component({
  templateUrl: './dbmt02.component.html'
})

export class Dbmt02Component implements OnInit {
  displayedColumns: string[] = ['PositionCode', 'PositionNameTha', 'PositionNameEng', 'Active', 'Delete'];
  displayedColumnsNodelete: string[] = ['PositionCode', 'PositionNameTha', 'PositionNameEng', 'Active'];
  keyword = '';
  initialPageSorts = new PageCriteria('PositionCode,PositionNameTha,PositionNameEng,Active');
  searchForm!: FormGroup;
  data!: PaginatedDataSource<any, any>;
  actions: any;
  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private db: Dbmt02Service,
    private ms: MessageService,
    private save: SaveDataService) { }
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.dbmt02.actions;
    });
    this.initialPageSorts = this.save.retrive('dbmt02page') ?? this.initialPageSorts;
    this.keyword = this.save.retrive('dbmt02') ?? '';
    this.data = new PaginatedDataSource<any, any>((request, query) => this.db.getPosiationList(request, query),this.initialPageSorts)
    this.data.queryBy({ keyword: this.keyword });
  }
  onSearch(value: string) {
    this.keyword = value;
    this.data.queryBy({ keyword: this.keyword }, true);
  }
  add() {
    this.router.navigate(['/db/dbmt02/detail']);
  }
  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.db.delete(row.positionCode, row.rowVersion))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.data.calculatePageAfterDelete();
      this.data.fetch(page);
    })
  }
}