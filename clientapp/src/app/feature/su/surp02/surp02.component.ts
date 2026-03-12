import { Component, OnInit } from '@angular/core';
import { Surp02Service } from './surp02.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';
import { LookupSource } from '@app/shared/components/lookup/lookup.source';
import { Surp02UserLookupComponent } from './surp02-user-lookup.component';

@Component({
  selector: 'app-surp02',
  templateUrl: './surp02.component.html'
})
export class Surp02Component implements OnInit {
  saving = false;
  master: {
    activeStatus: {text:string, value:string}[],
    companyList: {text:string, value:string}[],
  };
  reportForm: FormGroup;
  userNameSource: LookupSource;
  actions: any;

  constructor(
    private surp02Service: Surp02Service,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    this.userNameSource = new LookupSource((term, value) => this.surp02Service.getUserLookUp(term, value));

    this.route.data.subscribe((data) => {
      this.master = data.surp02.master;
      this.actions = data.surp02.actions;
    });

    this.reportForm = this.fb.group({
      companyCodeFrom: [null],
      companyCodeTo: [null],
      userNameFrom: [null],
      userNameTo: [null],
      active: ['Y'],
      reportName: 'Surp02',
      exportType: 'XLSX'
    });
  }

  getReport(): void {
    if (this.reportForm.invalid) {
      this.util.markFormGroupTouched(this.reportForm);
      return;
    }

    this.saving = true;
    this.surp02Service.getReport(this.reportForm.value).subscribe({
      next: (response) => {
        if (response) {
          const base64Data = response.trim();
          const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'report.xlsx';
          link.click();
        }
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  onOpenUserNameLookup = (value: any) => {
    return this.modal.open(Surp02UserLookupComponent, { keyword: value }, Size.Large);
  };
}