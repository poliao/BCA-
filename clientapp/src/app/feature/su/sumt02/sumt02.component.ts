import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Sumt02Service } from './sumt02.service';


@Component({
  selector: 'app-sumt02',
  templateUrl: './sumt02.component.html'
})
export class Sumt02Component implements OnInit {

  displayedColumns: string[] = ['companyCode', 'companyNameTha', 'companyNameEng', 'mainCompany','isBranch', 'active', 'action'];
  displayedColumnsNodelete: string[] = ['companyCode', 'companyNameTha', 'companyNameEng', 'mainCompany','isBranch', 'active'];
  keyword = '';
  initialPageSort = new PageCriteria('companyCode,companyNameTha,companyNameEng,mainCompany,isBranch,active');
  data!: PaginatedDataSource<any, any>;
  actions: any;
  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private su: Sumt02Service,
    private ms: MessageService,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.sumt02.actions;
    });
    this.initialPageSort = this.save.retrive('sumt02page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('sumt02') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.su.getCompanies(request, query),
      this.initialPageSort)

    this.data.queryBy({ keyword: this.keyword });
  }

  ngOnDestroy() {
    this.save.save(this.keyword, 'sumt02');
    this.save.save(this.data.getPageInfo(), 'sumt02page');
  }

  onSearch(value: string) {
    this.keyword = value;
    this.data.queryBy({ keyword: this.keyword }, true);
  }


  add() {
    this.router.navigate(['/su/sumt02/detail']);
  }


  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.su.delete(row.companyCode, row.rowVersion))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.data.calculatePageAfterDelete();
      this.data.fetch(page);
    })
  }
}
