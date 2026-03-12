import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Dbmt081Service } from './dbmt08-1.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dbmt08-1',
  templateUrl: './dbmt08-1.component.html'
})
export class Dbmt081Component implements OnInit {

  displayedColumns: string[] = ['districtNameTHA', 'districtNameENG', 'active', 'action', 'goSubDistrict'];
  displayedColumnsNodelete: string[] = ['districtNameTHA', 'districtNameENG', 'active', 'goSubDistrict'];
  master = {};
  keyword = '';
  initialPageSort = new PageCriteria('districtNameTHA,districtNameENG');
  searchForm!: FormGroup;
  headerForm!: FormGroup;
  data!: PaginatedDataSource<any, any>;
  actions: any;
  provinceId: any;
  headerDetail: any;
  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private db: Dbmt081Service,
    private fb: FormBuilder,
    private ms: MessageService,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.dbmt081.actions;
      this.provinceId = data.dbmt081.provinceId;
      this.headerDetail= data.dbmt081.detail;
      
    });
    this.createSearchForm();
    this.createHeaderForm()
    this.rebuildForm();
    this.initialPageSort = this.save.retrive('dbmt081page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('dbmt081') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.db.getDistrict(request, query),
      this.initialPageSort)
      this.data.queryBy(this.searchForm.value);
    
  }

  ngOnDestroy() {
    this.save.save(this.keyword, 'dbmt081');
    this.save.save(this.data.getPageInfo(), 'dbmt081page');
  }

  createHeaderForm() {
    this.headerForm = this.fb.group({
      provinceId: null,
      provinceNameTHA: null,
      provinceNameENG: null,
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      keyword: null,
      provinceId: null
    })
  }

  add() {
    this.router.navigate(['/db/dbmt08-1/detail', {CreatePId: this.headerForm.controls.provinceId.value}]);
  }

  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.db.delete(row.districtId, row.rowVersion))
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
  goSubDistrict(row) {
    this.router.navigate(['/db/dbmt08-2', { DistrictId: row.districtId }]);
  }

  rebuildForm() {
    this.headerForm.markAsPristine();
    this.headerForm.patchValue(this.headerDetail);
    this.searchForm.controls.provinceId.setValue(this.headerDetail.provinceId)
    this.headerForm.disable();

  }
}
