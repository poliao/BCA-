import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '@app/core/services/message.service';
import {ModalService} from '@app/shared/components/modal/modal.service';
import {SubscriptionDisposer} from '@app/shared/components/subscription-disposer';
import {FormDatasource} from '@app/shared/service/base.service';
import {FormUtilService} from '@app/shared/service/form-util.service';
import {BehaviorSubject, Observable, switchMap} from 'rxjs';
import {DbEmployee, MGM} from './dbmt01.model';
import {Dbmt01Service} from './dbmt01.service';
import {MatTableDataSource} from '@angular/material/table';
import {idCardPattern} from '@app/shared/validator/id-card.validator';
import {ImageFile} from '@app/shared/components/attachment/image/image-file.model';

@Component({
  selector: 'app-dbmt01-detail',
  templateUrl: './dbmt01-detail.component.html'
})
export class Dbmt01DetailComponent extends SubscriptionDisposer implements OnInit {
  master = {
    company: [],
    prefix: [],
    position: [],
    month: [],
    nationality: [],
    country: [],
    province: [],
    district: [],
    subDistrict: [] as any[],
    postalSubDistrict: [] as any[],
    programTypes: []
  };
  provinceObserv = new BehaviorSubject<any[]>([]);
  subCompanyObserv = new BehaviorSubject<any[]>([]);
  districtObserv = new BehaviorSubject<any[]>([]);
  subDistrictObserv = new BehaviorSubject<any[]>([]);
  PostalSubDisObserv = new BehaviorSubject<any[]>([]);
  departmentObserv = new BehaviorSubject<any[]>([]);
  MGMDataSources: FormDatasource<MGM>[] = [];
  MgmEmployee!: MatTableDataSource<FormDatasource<MGM>>;
  dbEmployee: DbEmployee = {mgmTarget: []} as DbEmployee;
  EmployeeDataSource!: FormDatasource<DbEmployee>;
  saving = false;
  actions: any;
  signatureImg: any;
  imageFile: ImageFile = new ImageFile();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private modal: ModalService,
    public dialog: MatDialog,
    private readonly ms: MessageService,
    private readonly db: Dbmt01Service
  ) {
    super();
  }

  ngOnInit(): void {
    this.MgmEmployee = new MatTableDataSource<FormDatasource<MGM>>([]);
    this.route.data.subscribe((data) => {
      this.dbEmployee = data.dbmt01.detail;
      this.actions = data.dbmt01.actions;
      Object.assign(this.master, data.dbmt01.master);
      this.rebuildForm();
    });
    this.signatureImg = this.dbEmployee.signatureImgPath;
  }

  createEmployeeForm(cp: DbEmployee) {
    const fg = this.fb.group({
      employeeCode: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'), Validators.maxLength(20)]],
      prefixId: [null, Validators.required],
      firstName: [null, [Validators.required, Validators.maxLength(100)]],
      lastName: [null, [Validators.required, Validators.maxLength(100)]],
      firstNameEn: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'), Validators.maxLength(100)]],
      lastNameEn: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'), Validators.maxLength(100)]],
      companyCode: [null, Validators.required],
      positionCode: [null, Validators.required],
      departmentCode: [null, Validators.required],
      idCard: [null, [Validators.required, idCardPattern()]],
      passportNo: [null, Validators.maxLength(20)],
      mobileNo: [null, Validators.maxLength(20)],
      nationalityCode: [null],
      raceCode: [null],
      countryCode: [null],
      provinceId: [null],
      districtId: [null],
      subDistrictId: [null],
      address: [null, Validators.maxLength(500)],
      postalCode: [null],
      email: [null, [Validators.required, Validators.email, Validators.maxLength(200)]],
      isMobile: [false],
      insuranceLicenseNo: [null],
      insuranceEntityCode: [null],
      signature: null,
      subCompany: [null, Validators.required],
      lineOfBusinessCode: [{value: null, disabled: true}],
      divisionSubCode: [{value: null, disabled: true}],
      departmentSubCode: [{value: null, disabled: true}]
    });

    if (this.dbEmployee.rowVersion) {
      fg.controls.employeeCode.disable({emitEvent: false});
      // fg.controls.companyCode.disable({emitEvent: false});
      if (cp.subCompany != null) {
        // fg.controls.subCompany.disable({emitEvent: false});
      }
    }

    fg.controls.companyCode.valueChanges.subscribe(value => {
      this.departmentObserv.next([]);
      if (fg.controls.companyCode.dirty)
        fg.controls.departmentCode.setValue(null);
      if (fg.controls.subCompany.dirty)
        fg.controls.subCompany.setValue(null);
      if (value)
        this.db.getMaster('subcompany', value).subscribe(res => {
          this.subCompanyObserv.next(res.subCompany);
        })
      this.db.getMaster('department', value).subscribe(res => {
        this.departmentObserv.next(res.department);
      })
    });

    fg.controls.countryCode.valueChanges.subscribe(value => {
      this.provinceObserv.next([]);
      if (fg.controls.countryCode.dirty)
        fg.controls.provinceId.setValue(null);
      fg.controls.districtId.setValue(null);
      fg.controls.subDistrictId.setValue(null);
      fg.controls.postalCode.setValue(null);
      if (!value) fg.controls.postalCode.markAsTouched()
      if (value)
        this.provinceObserv.next(this.master.province.filter(o => o.countryId === fg.controls.countryCode.value));
    });

    fg.controls.provinceId.valueChanges.subscribe(value => {
      this.districtObserv.next([]);
      if (fg.controls.provinceId.dirty)
        fg.controls.districtId.setValue(null);
      fg.controls.subDistrictId.setValue(null);
      fg.controls.postalCode.setValue(null);
      if (!value) fg.controls.postalCode.markAsTouched()
      if (value)
        this.districtObserv.next(this.master.district.filter(o => o.provinceId === fg.controls.provinceId.value));
    });

    fg.controls.districtId.valueChanges.subscribe(value => {
      this.subDistrictObserv.next([]);
      if (fg.controls.districtId.dirty)
        fg.controls.subDistrictId.setValue(null);
      fg.controls.postalCode.setValue(null);
      if (value)
        this.subDistrictObserv.next(this.master.subDistrict.filter(o => o.districtId === fg.controls.districtId.value));
    });

    fg.controls.subDistrictId.valueChanges.subscribe(value => {
      this.PostalSubDisObserv.next([]);
      if (fg.controls.subDistrictId.dirty)
        fg.controls.postalCode.setValue(null);
      if (value)
        var selectPostal: any
      this.PostalSubDisObserv.next(selectPostal = this.master.postalSubDistrict.filter(o => o.provinceId === fg.controls.provinceId.value));
      if (selectPostal && selectPostal.length > 0) {
        if (fg.controls.postalCode.value == null) {
          fg.controls.postalCode.setValue(selectPostal[0].value);
        }
      }
    });

    fg.controls.departmentCode.valueChanges.subscribe(value => {
      if (value) {
        this.getDataDivision(value);
      } else {
        fg.controls.lineOfBusinessCode.setValue(null, {emitEvent: false});
        fg.controls.divisionSubCode.setValue(null, {emitEvent: false});
        fg.controls.departmentSubCode.setValue(null, {emitEvent: false});
      }
    })

    return fg;
  }

  createMGMForm(mgm: MGM) {
    const fg = this.fb.group({
      employeeMgmTargetId: [null],
      year: [null],
      monthCode: [null, Validators.required],
      target: [null],
    })

    return fg;
  }

  rebuildForm() {
    this.EmployeeDataSource = new FormDatasource<DbEmployee>(this.dbEmployee, this.createEmployeeForm(this.dbEmployee))
    this.MGMDataSources = [];
    if (this.dbEmployee.mgmTarget) {
      this.dbEmployee.mgmTarget.forEach(mgmRes => {
        const mgmData = new FormDatasource<MGM>(mgmRes, this.createMGMForm(mgmRes))
        this.MGMDataSources.push(mgmData);
      })
    }
    this.reload();
  }

  save() {
    let invalid = false;
    this.util.markFormGroupTouched(this.EmployeeDataSource.form);
    if (this.EmployeeDataSource.form.invalid) invalid = true;

    if (this.MGMDataSources.some(source => source.form.invalid)) {
      this.MGMDataSources.forEach(source => this.util.markFormGroupTouched(source.form));
      this.ms.warning('message.STD00000')
      invalid = true;
    }

    if (invalid) return;

    this.EmployeeDataSource.updateValue();
    this.MGMDataSources.forEach(data => {
      data.updateValue();
    })

    const mgmData = this.MGMDataSources.filter(source => !source.isNormal).map(source => source.model);
    this.dbEmployee.mgmTarget = mgmData;

    this.db.save(this.dbEmployee, this.imageFile).pipe(
      switchMap(() => this.db.getEmployee(this.dbEmployee.employeeCode))
    ).subscribe(res => {
      this.dbEmployee = res;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    });
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.EmployeeDataSource.form.dirty) {
      return this.modal.confirm("message.STD00002");
    }
    return true;
  }

  reload() {
    this.MgmEmployee.data = this.MGMDataSources.filter(o => !o.isDelete);
  }

  add() {
    const mgm = new MGM();
    const DataSource = new FormDatasource<MGM>(mgm, this.createMGMForm(mgm));
    this.MGMDataSources.push(DataSource);
    this.reload();
    this.EmployeeDataSource.form.markAsDirty();
  }

  remove(source: FormDatasource<MGM>) {
    if (source.isAdd) {
      this.MGMDataSources = this.MGMDataSources.filter(o => o.id !== source.id);
    } else source.markForDelete();
    this.reload();
    this.EmployeeDataSource.form.markAsDirty();
  }

  onFileUpdated(newFile: ImageFile | null): void {
    this.imageFile = newFile;
  }

  onRemoveImgWeb(fileName: string) {
    this.EmployeeDataSource.form.controls['signature'].setValue(null, {emitEvent: false});
    this.imageFile = null;
  }


  getAllSubCompanies(parentCode: string, companies: any[]): any[] {
    const result: any[] = [];
    const directSubs = companies.filter(c => c.mainCompany === parentCode);

    for (const sub of directSubs) {
      result.push(sub);
      // ค้นหาลูกของลูกต่อไป
      const childSubs = this.getAllSubCompanies(sub.companyCode, companies);
      result.push(...childSubs);
    }

    return result;
  }

  getDataDivision(divisionCode: string){
    this.db.getDataDivision(divisionCode).pipe(
    ).subscribe(data=>{
      this.EmployeeDataSource.form.controls.lineOfBusinessCode.setValue(data.lineOfBusinessCode, {emitEvent: false});
      this.EmployeeDataSource.form.controls.divisionSubCode.setValue(data.divisionSubCode, {emitEvent: false});
      this.EmployeeDataSource.form.controls.departmentSubCode.setValue(data.departmentSubCode, {emitEvent: false});
    })
  }
}
