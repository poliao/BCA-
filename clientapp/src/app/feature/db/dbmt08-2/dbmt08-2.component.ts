import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { SaveDataService } from '@app/core/services/save-data.service';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { PaginatedDataSource } from '@app/shared/components/datatable/server-datasource';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { filter, switchMap } from 'rxjs';
import { Dbmt082Service } from './dbmt08-2.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-dbmt08-2',
  templateUrl: './dbmt08-2.component.html'
})
export class Dbmt082Component implements OnInit {

  displayedColumns: string[] = ['subDistrictNameTHA', 'subDistrictNameENG', 'active', 'action'];
  displayedColumnsNodelete: string[] = ['subDistrictNameTHA', 'subDistrictNameENG', 'active'];
  master = {};
  keyword = '';
  initialPageSort = new PageCriteria('subDistrictNameTHA,subDistrictNameENG');
  searchForm!: FormGroup;
  headerForm!: FormGroup;
  data!: PaginatedDataSource<any, any>;
  actions: any;
  districtId: any;
  headerDetail: any;
  constructor(
    private router: Router,
    private modal: ModalService,
    private readonly route: ActivatedRoute,
    private db: Dbmt082Service,
    private fb: FormBuilder,
    private ms: MessageService,
    private save: SaveDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.dbmt082.actions;
      this.districtId = data.dbmt082.districtId;
      this.headerDetail= data.dbmt082.detail
      
    });
    this.createSearchForm();
    this.createHeaderForm()
    this.rebuildForm();
    this.initialPageSort = this.save.retrive('dbmt082page') ?? this.initialPageSort;
    this.keyword = this.save.retrive('dbmt082') ?? '';
    this.data = new PaginatedDataSource<any, any>(
      (request, query) => this.db.getSubDistrict(request, query),
      this.initialPageSort)
      this.data.queryBy(this.searchForm.value);
    
  }

  ngOnDestroy() {
    this.save.save(this.keyword, 'dbmt082');
    this.save.save(this.data.getPageInfo(), 'dbmt082page');
  }

  createHeaderForm() {
    this.headerForm = this.fb.group({
      districtId: null,
      districtNameTHA: null,
      districtNameENG: null,
    });
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      keyword: null,
      districtId: null
    })
  }

  add() {
    this.router.navigate(['/db/dbmt08-2/detail', {CreateDId: this.headerForm.controls.districtId.value}]);
  }

  remove(row: any) {
    this.modal.confirm('message.STD00003').pipe(
      filter(confirm => confirm),
      switchMap(() => this.db.delete(row.subDistrictId, row.rowVersion))
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

  rebuildForm() {
    this.headerForm.markAsPristine();
    this.headerForm.patchValue(this.headerDetail);
    this.searchForm.controls.districtId.setValue(this.headerDetail.districtId)
    this.headerForm.disable();

  }
}
