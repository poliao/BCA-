import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { DbDistrict } from './dbmt08-1.model';
import { Dbmt081Service } from './dbmt08-1.service';

@Component({
  selector: 'app-dbmt08-1-detail',
  templateUrl: './dbmt08-1-detail.component.html'
})
export class Dbmt081DetailComponent extends SubscriptionDisposer implements OnInit {
  master = {};
  District: DbDistrict = {} as DbDistrict;
  DistrictDataSource!: FormDatasource<DbDistrict>;
  currentLanguage!: { text: string, value: string };
  sort: any[]
  saving = false;
  actions: any;
  createPId: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private modal: ModalService,
    public dialog: MatDialog,
    private readonly ms: MessageService,
    private readonly db: Dbmt081Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.District = data.dbmt081.detail;
      this.actions = data.dbmt081.actions;
      this.createPId = data.dbmt081.CreatePId;
      this.rebuildForm();
    });
  }

  createDistrictForm() {
    const fg = this.fb.group({
      districtNameTHA: [null, Validators.required],
      districtNameENG: null,
      provinceId: null,
      active: true,
      rowVersion: null,
    });
    return fg;
  }


  rebuildForm(){
    this.DistrictDataSource = new FormDatasource<DbDistrict>(this.District, this.createDistrictForm());
    if (this.District.rowVersion != null) {
      this.DistrictDataSource.form.controls.rowVersion.setValue(this.District.rowVersion);
    }
    if (this.createPId != null) {
      this.DistrictDataSource.form.controls.provinceId.setValue(this.createPId);
    }
    
  }

  save(){
    let invalid = false;
    this.util.markFormGroupTouched(this.DistrictDataSource.form);
    if (this.DistrictDataSource.form.invalid) invalid = true;


    if (invalid) return;

    this.DistrictDataSource.updateValue();

    this.db.save(this.District).pipe(
      switchMap(() => this.db.getDistrictDetail(this.District.provinceId, this.District.districtId, this.District.districtNameTHA))
    ).subscribe(res => {
      this.District = res;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.DistrictDataSource.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return true;
  }

}
