import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Dbmt01Service } from './dbmt01.service';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dbmt01',
  templateUrl: './dbmt01.component.html'
})
export class Dbmt01Component implements OnInit {
  displayedColumns: string[] = ['employeeCode', 'name', 'companyName', 'subCompanyName', 'lineOfBusinessCode', 'divisionSubCode', 'departmentSubCode', 'position', 'action'];
  displayedColumnsNodelete: string[] = ['employeeCode', 'name', 'companyName', 'subCompanyName', 'lineOfBusinessCode', 'divisionSubCode', 'departmentSubCode', 'position'];
  keyword = '';
  initialPageSort = new PageCriteria('employeeCode,name');
  searchForm!: FormGroup;
  data!: PaginatedDataSource<any, any>;
  actions: any;
  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private db: Dbmt01Service,
    private ms: MessageService,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.dbmt01.actions;
    });
    this.initialPageSort = this.save.retrive('dbmt01page') ?? this.initialPageSort;

    this.keyword = this.save.retrive('dbmt01') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.db.getEmployees(request, query),
      this.initialPageSort)

    this.data.queryBy({ keyword: this.keyword });
  }

  ngOnDestroy() {
    this.save.save(this.keyword, 'dbmt01');
    this.save.save(this.data.getPageInfo(), 'dbmt01page');
  }

  onSearch(value: string) {
    this.keyword = value;
    this.data.queryBy({ keyword: this.keyword }, true);
  }

  add() {
    this.router.navigate(['/db/dbmt01/detail']);
  }

  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.db.delete(row.employeeCode, row.companyCode, row.rowVersion))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.data.calculatePageAfterDelete();
      this.data.fetch(page);
    })
  }
}
