import { Component, OnInit } from '@angular/core';
import { Surp03Service } from './surp03.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { MessageService } from '@app/core/services/message.service';

@Component({
  selector: 'app-surp03',
  templateUrl: './surp03.component.html'
})
export class Surp03Component implements OnInit {

  saving: boolean = false;
  base64: string = null;
  pdfUrl: SafeResourceUrl = null;
  master: any;
  reportForm: FormGroup;
  minEndDate: Date | null = null; // ตัวแปรสำหรับ minDate ของ endDate
  actions: any;
  radioItems = [{ value: 'pdf', text: 'PDF' }, { value: 'xlsx', text: 'EXCEL' }];

  constructor(
    private surp03Service: Surp03Service,
    private readonly route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.master = data.surp03.master;
      this.actions = data.surp03.actions;
    });

    this.reportForm = this.fb.group({
      profileCodeFrom: [null, [Validators.required,]],
      profileCodeTo: [null, [Validators.required,]],
      system: [null, [Validators.required,]],
      reportName: 'Matrix',
      exportType: ['pdf']
    });

    this.reportForm.get('exportType')?.valueChanges.subscribe((exportType: string) => {
      if (exportType === 'xlsx') {
        this.reportForm.get('reportName')?.setValue('Matrix_xlsx');
      } else {
        this.reportForm.get('reportName')?.setValue('Matrix');  // Reset to default if not xlsx
      }
    });
  }

  getreport(): void {
    this.saving = true;
    if (this.reportForm.value.system !== null && this.reportForm.value.profileCode !== null) {
      const formData = this.reportForm.value;
      this.surp03Service.getReport(formData)
        .subscribe((response) => {
          this.saving = false;

          if (response) {
            const base64Data = response.trim();
            const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'รายงานตารางกำหนดสิทธิ์การใช้งานระบบ.'+this.reportForm.value.exportType;
            link.click();
          }
        }, (error) => {
          console.error('Error:', error);
          this.saving = false;
        });
    }
    else if (this.reportForm.value.system === null) {
      this.saving = false;
      this.util.markFormGroupTouched(this.reportForm);
    }
    else if (this.reportForm.value.profileCode === null) {
      this.util.markFormGroupTouched(this.reportForm);
      this.saving = false;
    }
  }
}
