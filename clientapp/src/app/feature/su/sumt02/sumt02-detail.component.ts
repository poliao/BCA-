import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';
import { Pattern } from '@app/shared/components/textbox/pattern';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { BehaviorSubject, Observable, of, switchMap, takeUntil, timer } from 'rxjs';
import { SuCompany } from './sumt02.model';
import { Sumt02Service } from './sumt02.service';
import { ImageFile } from '@app/shared/components/attachment/image/image-file.model';
import { Category } from '@app/shared/components/attachment/category';

@Component({
  selector: 'app-sumt02-detail',
  templateUrl: './sumt02-detail.component.html'
})
export class Sumt02DetailComponent extends SubscriptionDisposer implements OnInit {
  master = {  mainCompany: [], personalTaxTypeCode: [], provinceId:[], districtId: [],
              tambol:[], postalCode:[], regionId: [], langCodes: [] as any[], langCodesTo: [] as any[], programTypes: [] , departmentForBg: [] as any[]};
  program: SuCompany = {  } as SuCompany;
  districtObserv = new BehaviorSubject<any[]>([]);
  subDistrictObserv = new BehaviorSubject<any[]>([]);
  PostalSubDisObserv = new BehaviorSubject<any[]>([]);
  langs!: MatTableDataSource<any>;
  imageFile: ImageFile = new ImageFile();
  category = Category.Company;

  programDataSource!: FormDatasource<SuCompany>;
  currentLanguage!: { text: string, value: string };
  actions : any ;
  saving = false;
  departmentForBg : any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly modal: ModalService,
    public dialog: MatDialog,
    private readonly ms: MessageService,
    private readonly su: Sumt02Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.actions = data.sumt02.actions;
      this.program = data.sumt02.detail;
      Object.assign(this.master, data.sumt02.master);
      this.langs = new MatTableDataSource<any>(this.master.langCodes);
      this.rebuildForm();
    });
  }

  createProgramForm() {
    const fg = this.fb.group({
      companyCode: [null, [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9]+$/)]],
      companyNameTha: [null, [Validators.required, Validators.maxLength(100)]],
      companyNameEng: [null, [Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~\s]*$/), Validators.maxLength(100)]],
      addressTha: [null, [Validators.required, Validators.maxLength(500)]],
      addressEng: [null, [Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~\s]*$/), Validators.maxLength(500)]],
      districtId: null,
      moo: [null, Validators.maxLength(100)],
      soi: [null, Validators.maxLength(100)],
      road: [null, Validators.maxLength(100)],
      tambol: null,
      postalCode: null,
      mainCompany: [null, Validators.required],
      departmentCode: [null],
      telephoneNo: [null, [Validators.pattern('[0-9-#,]*'), Validators.maxLength(20)]],
      faxNo: [null, [Validators.pattern('[0-9-#,]*'), Validators.maxLength(20)]],
      email: [null, [Validators.email, Validators.maxLength(100)]],
      personalTaxTypeCode: [null, Validators.required],
      taxId: [null, [Validators.required, Validators.maxLength(20)]],
      socailSecurityNo: [null, Validators.maxLength(20)],
      socailSecurityBranch: [null, Validators.maxLength(100)],
      website: [null, Validators.maxLength(500)],
      googleMap: [null, Validators.maxLength(500)],
      provinceId: null,
      receiptBranchCode: [null, [Validators.required, Validators.maxLength(20)]],
      receiptBranchName: [null, [Validators.required, Validators.maxLength(100)]],
      mapName: null,
      active: true,
      isBranch: false,
      revenueStampBranchNo: [null, Validators.maxLength(5)],
      billPaymentFlag: false,
      isMobile: false,
      comCode: [null, [Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
      suffixCode: [null, [Validators.pattern('[0-9]*'), Validators.maxLength(5)]],
      regionId: null,
      isCompanyTracking: false,
      originCode: [null, Validators.pattern('[0-9-#,]*')]
    })
  
    fg.controls.mainCompany.valueChanges.subscribe(value => {
        this.su.getDepartmentForBg(value).subscribe(data => this.departmentForBg = data);
        fg.controls.departmentCode.setValue(null);
    });

    fg.controls.isBranch.valueChanges.subscribe(value => {
      if (value == true) {
        fg.controls.departmentCode.setValue(null);
        fg.controls.departmentCode.disable({ emitEvent: false });
      } else {
        fg.controls.departmentCode.enable({ emitEvent: false });
      }
    });

    fg.controls.provinceId.valueChanges.subscribe(value => {
      this.districtObserv.next([]);
      if (fg.controls.provinceId.dirty)
        fg.controls.districtId.setValue(null);
        fg.controls.tambol.setValue(null);
        fg.controls.postalCode.setValue(null);
        if(!value) fg.controls.postalCode.markAsTouched()
      if (value)
        this.districtObserv.next(this.master.districtId.filter(o => o.provinceId === fg.controls.provinceId.value));
    });

    fg.controls.districtId.valueChanges.subscribe(value => {
      this.subDistrictObserv.next([]);
      if (fg.controls.districtId.dirty)
        fg.controls.tambol.setValue(null);
        fg.controls.postalCode.setValue(null);
      if (value)
        this.subDistrictObserv.next(this.master.tambol.filter(o => o.districtId === fg.controls.districtId.value));
    });

    fg.controls.tambol.valueChanges.subscribe(value => {
      this.PostalSubDisObserv.next([]);
      if (fg.controls.tambol.dirty)
        fg.controls.postalCode.setValue(null);
      if (value)
        var selectPostal:any
          this.PostalSubDisObserv.next(selectPostal = this.master.postalCode.filter(o => o.provinceId === fg.controls.provinceId.value));
        if(selectPostal && selectPostal.length > 0){
          fg.controls.postalCode.setValue(selectPostal[0].value);
        }
    });
    if (this.program.rowVersion) {
      fg.controls.companyCode.disable({ emitEvent: false });
    }
    return fg;
  }

  rebuildForm() {
    this.programDataSource = new FormDatasource<SuCompany>(this.program, this.createProgramForm());
    this.changeLanguage(this.currentLanguage ?? this.master.langCodes[0]);
  }

  changeLanguage(lang: any) {
    this.currentLanguage = lang;
  }

  save() {
    let invalid = false;
    this.util.markFormGroupTouched(this.programDataSource.form);
    if (this.programDataSource.form.invalid) invalid = true;
    if (invalid) return this.ms.warning('message.STD00048');

    this.programDataSource.updateValue();

    this.su.save(this.program, this.imageFile).pipe(
      switchMap(() => this.su.getCompany(this.program.companyCode))
    ).subscribe(program => {
      this.program = program;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    })
  }

  canDeactivate(): Observable<boolean> {
    if (this.programDataSource.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return of(true);
  }

  onFileUpdated(newFile: ImageFile | null): void {
    this.imageFile = newFile;
  }

  onRemoveImgWeb(fileName: string) {
    this.programDataSource.form.controls['mapName'].setValue(null, { emitEvent: false });
    this.imageFile = null;
  }


}
