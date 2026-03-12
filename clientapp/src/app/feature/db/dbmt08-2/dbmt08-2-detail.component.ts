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
import { DbSubDistrict } from './dbmt08-2.model';
import { Dbmt082Service } from './dbmt08-2.service';

@Component({
  selector: 'app-dbmt08-2-detail',
  templateUrl: './dbmt08-2-detail.component.html'
})
export class Dbmt082DetailComponent extends SubscriptionDisposer implements OnInit {
  master = {};
  SubDistrict: DbSubDistrict = {} as DbSubDistrict;
  SubDistrictDataSource!: FormDatasource<DbSubDistrict>;
  currentLanguage!: { text: string, value: string };
  sort: any[]
  valueSet: string
  saving = false;
  actions: any;
  createDId: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private modal: ModalService,
    public dialog: MatDialog,
    private readonly ms: MessageService,
    private readonly db: Dbmt082Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.SubDistrict = data.dbmt082.detail;
      this.actions = data.dbmt082.actions;
      this.createDId = data.dbmt082.CreateDId;
      this.rebuildForm();
      
    });
  }

  createSubDistrictForm() {
    const fg = this.fb.group({
      subDistrictNameTHA: [null, Validators.required],
      subDistrictNameENG: null,
      districtId: null,
      active: true,
      rowVersion: null,
    });
    return fg;
  }


  rebuildForm(){
    this.SubDistrictDataSource = new FormDatasource<DbSubDistrict>(this.SubDistrict, this.createSubDistrictForm());
    if (this.SubDistrict.rowVersion != null) {
      this.SubDistrictDataSource.form.controls.rowVersion.setValue(this.SubDistrict.rowVersion);
    }

    if (this.createDId != null) {
      this.SubDistrictDataSource.form.controls.districtId.setValue(this.createDId);
    }
    
  }

  save(){
    let invalid = false;
    this.util.markFormGroupTouched(this.SubDistrictDataSource.form);
    if (this.SubDistrictDataSource.form.invalid) invalid = true;

    if (invalid) return;

    this.SubDistrictDataSource.updateValue();
    
    this.db.save(this.SubDistrict).pipe(
      switchMap(() => this.db.getSubDistrictDetail(this.SubDistrict.districtId, this.SubDistrict.subDistrictId, this.SubDistrict.subDistrictNameTHA))
    ).subscribe(res => {
      this.SubDistrict = res;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.SubDistrictDataSource.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return true;
  }

}
