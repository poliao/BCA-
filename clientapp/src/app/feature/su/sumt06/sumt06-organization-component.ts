import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { MessageService } from '@app/core/services/message.service';
import { FormDatasource } from '@app/shared/service/base.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { SuDepartmentDetail, Sumt06Service } from './sumt06.service';
import { RowState } from '@app/shared/constants';

@Component({
  selector: 'app-sumt06-component',
  templateUrl: './sumt06-organization-component.html'
})
export class Sumt06OrganizationComponent implements OnInit {
  divisions = new BehaviorSubject<any[]>([]);
  departmentDetailDataSource!: FormDatasource<SuDepartmentDetail>;
  departmentDetail: SuDepartmentDetail = { departments: [] } as SuDepartmentDetail;
  originalDepartments: any[] = [];
  actions: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private su: Sumt06Service
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.divisions.next(data.sumt06.department);
      this.departmentDetail = data.sumt06.departmentDetail;
      this.originalDepartments = [...this.departmentDetail.departments];
      this.rebuildForm();
      this.actions = data.sumt06.actions;
    });
  }

  createForm(s: SuDepartmentDetail) {
    return this.fb.group({
      userId: [{ value: null, disabled: true }],
      userName: [{ value: null, disabled: true }],
      empName: [{ value: null, disabled: true }],
      companyName: [{ value: null, disabled: true }]
    });
  }

  rebuildForm() {
    this.departmentDetailDataSource = new FormDatasource<SuDepartmentDetail>(
      this.departmentDetail,
      this.createForm(this.departmentDetail)
    );
  }

  isChecked(departmentCode: string): boolean {
    return this.departmentDetail.departments.some(d => d.departmentCode === departmentCode);
  }

  onDivisionToggle(div: any, checked: boolean) {
    const index = this.departmentDetail.departments.findIndex(d => d.departmentCode === div.departmentCode);
    if (checked && index === -1) {
      this.departmentDetail.departments.push({ ...div });
    } else if (!checked && index > -1) {
      this.departmentDetail.departments.splice(index, 1);
    }
    this.divisionChanged();
  }

  divisionChanged() {
    this.departmentDetailDataSource.form.markAsDirty();
  }

  save() {
    this.util.markFormGroupTouched(this.departmentDetailDataSource.form);
    const current = this.departmentDetail.departments;
    const original = this.originalDepartments;
    const added = current.filter(
      c => !original.some(o => o.departmentCode === c.departmentCode)
    ).map(item => ({ ...item, rowState: RowState.Add }));

    const removed = original.filter(
      o => !current.some(c => c.departmentCode === o.departmentCode)
    ).map(item => ({ ...item, rowState: RowState.Delete }));

    this.departmentDetail.departments = [...added, ...removed];

    this.su.saveUserDepartment(this.departmentDetail).pipe(
      switchMap(() =>
        this.su.getDepartmentDtail(this.departmentDetail.companyCode, this.departmentDetail.userId)
      )
    ).subscribe(res => {
      this.departmentDetail = res;
      this.originalDepartments = [...res.departments];
      this.rebuildForm();
      this.ms.success('message.STD00006');
    });
  }
}

