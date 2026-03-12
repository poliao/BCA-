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
import { DbProvince } from './dbmt08.model';
import { Dbmt08Service } from './dbmt08.service';

@Component({
  selector: 'app-dbmt08-detail',
  templateUrl: './dbmt08-detail.component.html'
})
export class Dbmt08DetailComponent extends SubscriptionDisposer implements OnInit {
  master = {  country: [] };
  Province: DbProvince = {} as DbProvince;
  ProvinceDataSource!: FormDatasource<DbProvince>;
  currentLanguage!: { text: string, value: string };
  sort: any[]
  saving = false;
  actions: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private modal: ModalService,
    public dialog: MatDialog,
    private readonly ms: MessageService,
    private readonly db: Dbmt08Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.Province = data.dbmt08.detail;
      this.actions = data.dbmt08.actions;
      Object.assign(this.master, data.dbmt08.master);
      this.rebuildForm();
    });
  }

  createProvinceForm() {
    const fg = this.fb.group({
      provinceNameTHA: [null, Validators.required],
      provinceNameENG: null,
      countryCode: [null, Validators.required],
      active: true
    });

    return fg;
  }


  rebuildForm(){
    this.ProvinceDataSource = new FormDatasource<DbProvince>(this.Province, this.createProvinceForm())
  }

  save(){
    let invalid = false;
    this.util.markFormGroupTouched(this.ProvinceDataSource.form);
    if (this.ProvinceDataSource.form.invalid) invalid = true;


    if (invalid) return;

    this.ProvinceDataSource.updateValue();

    this.db.save(this.Province).pipe(
      switchMap(() => this.db.getProvinceDetail(this.Province.provinceNameTHA))
    ).subscribe(res => {
      this.Province = res;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.ProvinceDataSource.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return true;
  }

}
