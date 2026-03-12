import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Dbmt08Service } from './dbmt08.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dbmt08',
  templateUrl: './dbmt08.component.html'
})
export class Dbmt08Component implements OnInit {

  displayedColumns: string[] = ['provinceTH', 'provinceEN', 'country', 'active', 'action', 'goDistrict'];
  displayedColumnsNoDelete: string[] = ['provinceTH', 'provinceEN', 'country', 'active', 'goDistrict'];
  master = { country: []};
  keyword = '';
  initialPageSort = new PageCriteria('provinceTH,provinceEN,country');
  searchForm!: FormGroup;
  data!: PaginatedDataSource<any, any>;
  actions: any;
  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private db: Dbmt08Service,
    private fb: FormBuilder,
    private ms: MessageService,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.master = data.dbmt08.master;
      this.actions = data.dbmt08.actions;
    });
    this.createSearchForm();
    this.initialPageSort = this.save.retrive('dbmt08page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('dbmt08') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.db.getProvince(request, query),
      this.initialPageSort)

      this.data.queryBy(this.searchForm.value);
  }

  ngOnDestroy() {
    this.save.save(this.keyword, 'dbmt08');
    this.save.save(this.data.getPageInfo(), 'dbmt08page');
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      countryCode: null,
      provinceName: null
    })
  }

  add() {
    this.router.navigate(['/db/dbmt08/detail']);
  }

  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.db.delete(row.provinceId, row.rowVersion))
    ).subscribe(() => {
      this.ms.success('message.STD00014');
      const page = this.data.calculatePageAfterDelete();
      this.data.fetch(page);
    })
  }

  search() {
    this.data.queryBy(this.searchForm.value, true);
  }

  reset() {
    this.searchForm.reset();
  }
  goDistrict(row) {
    this.router.navigate(['/db/dbmt08-1', { ProvinceId: row.provinceId}]);
  }
}
