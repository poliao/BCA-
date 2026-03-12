import { Component, OnInit } from '@angular/core';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Dbdepartment, Dbdepartmentcompany} from './dbmt03.model';
import { FormBuilder, Validators } from '@angular/forms';
import { Dbmt03Service } from './dbmt03.service';
import { MatTableDataSource } from '@angular/material/table';
import { MessageService } from '@app/core/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  templateUrl: './dbmt03-detail.component.html',
})
export class Dbmt03DetailComponent implements OnInit {
  department: Dbdepartment = {departmentCompany: []} as Dbdepartment;
  departmentDataSource!: FormDatasource<Dbdepartment>; 
  saving = false;
  master: any; 
  departmentCompanyDataSources: FormDatasource<Dbdepartmentcompany>[] = [];
  departmentCompany!: MatTableDataSource<FormDatasource<Dbdepartmentcompany>>;
  actions: any;

  constructor(
    private readonly fb: FormBuilder,
    public util: FormUtilService,
    private readonly db: Dbmt03Service,
    private readonly ms: MessageService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.departmentCompany = new MatTableDataSource<FormDatasource<Dbdepartmentcompany>>([]);
    this.route.data.subscribe((data) => {
      this.department = data.dbmt03.detail;
      this.master = data.dbmt03.master;
      this.actions = data.dbmt03.actions;
      this.rebuildForm();
    });
  }

  save() {
    let invalid = false;

    if(this.departmentCompanyDataSources.filter(source => !source.isDelete).length === 0) {
      this.ms.warning('message.STD00051');
      return;
    }
    
    this.util.markFormGroupTouched(this.departmentDataSource.form);
    if (this.departmentDataSource.form.invalid){
      this.ms.warning('message.STD00000')
      invalid = true;
    } 
    if (this.departmentCompanyDataSources.some(source => source.form.invalid)) {
      this.departmentCompanyDataSources.forEach(source => this.util.markFormGroupTouched(source.form));
      this.ms.warning('message.STD00000')
      invalid = true;
    }
    if (invalid) return;
    this.departmentDataSource.updateValue();
    this.departmentCompanyDataSources.forEach(data => {
      data.updateValue();
    })
    const Company = this.departmentCompanyDataSources.filter(source => !source.isNormal).map(source => source.model);
    this.department.departmentCompany = Company;
    this.db.save(this.department).pipe(
      switchMap(() => this.db.getDepartment(this.department.departmentCode))
    ).subscribe(res => {
      this.department = res;
      this.rebuildForm();
      this.ms.success('message.STD00006');
    });
  }

  createMainForm(dm: Dbdepartment) {
    const formGroup = this.fb.group({
      departmentCode: [null, [Validators.required]],
      departmentNameTha: [null, [Validators.required]],
      departmentNameEng: [null, [Validators.required]],
      departmentParent: [null],
      departmentAbbreviation: [null],
      active: [true],
    });
    if (this.department.rowVersion) {
      formGroup.controls.departmentCode.disable();
    }
    return formGroup;
  }

  rebuildForm() {
    this.departmentDataSource = new FormDatasource<Dbdepartment>(this.department, this.createMainForm(this.department));
    this.departmentCompanyDataSources = [];
    this.department.departmentCompany.forEach(Company => {
      const CompanyData = new FormDatasource<Dbdepartmentcompany>(Company, this.createCompanyForm(Company))
      this.departmentCompanyDataSources.push(CompanyData);
    })
    this.reload();
  }
  add() {
    const company = new Dbdepartmentcompany();
    const companyDataSource = new FormDatasource<Dbdepartmentcompany>(company, this.createCompanyForm(company));
    this.departmentCompanyDataSources.push(companyDataSource);
    this.reload();
    this.departmentDataSource.form.markAsDirty()
  }

  remove(source: FormDatasource<Dbdepartmentcompany>) {
    if (source.isAdd) {
      this.departmentCompanyDataSources = this.departmentCompanyDataSources.filter((o) => o.id !== source.id);
    } 
    else source.markForDelete();
    this.reload();
    this.departmentDataSource.form.markAsDirty();
  }


  reload() {
    this.departmentCompany.data = this.departmentCompanyDataSources.filter((o) => !o.isDelete);
  }

  createCompanyForm(cm: Dbdepartmentcompany) {
    const fg = this.fb.group({
      companyCode: [{ value: cm.rowVersion ? cm.companyCode : null, disabled: !!cm.rowVersion }, [Validators.required]],
    });
    return fg;
  }
}
