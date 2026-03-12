import { Component, OnInit } from '@angular/core';
import { Surp04Service } from './surp04.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '@app/core/services/message.service';
import { FormUtilService } from '@app/shared/service/form-util.service';

@Component({
  selector: 'app-surp04',
  templateUrl: './surp04.component.html'
})
export class Surp04Component implements OnInit {

  saving: boolean = false;
  base64: string = null;
  pdfUrl: SafeResourceUrl = null;
  master: any;
  reportForm: FormGroup;
  minEndDate: Date | null = null; // ตัวแปรสำหรับ minDate ของ endDate
  actions: any;
  constructor(
    private surp04Service: Surp04Service,
    private readonly route: ActivatedRoute,
    private fb: FormBuilder,
    private ms: MessageService,
    public util: FormUtilService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.master = data.surp04.master;
      this.actions = data.surp04.actions;
    });

    this.reportForm = this.fb.group({
      systemList: [null, [Validators.required,]],
      actionlist: [null],
      startDate: [null, [Validators.required,]],
      endDate: [null, [Validators.required,]],
      reportName: 'WT_SURP04',
      exportType: 'XLSX'
    });


    this.reportForm.get('startDate')?.valueChanges.subscribe((startDate) => {
      const endDateControl = this.reportForm.get('endDate');

      if (startDate) {
        this.minEndDate = startDate;
        endDateControl?.setValue(null);
      } else {
        this.minEndDate = null;
        endDateControl?.setValue(null);
      }

      endDateControl?.updateValueAndValidity();
    });
  }

  getreport(): void {
    if (this.reportForm.invalid) {
      this.util.markFormGroupTouched(this.reportForm);
      return;
    }
    this.saving = true;
    const formData = this.reportForm.value;
    const langCode = localStorage.getItem('language') || 'TH';
    const startDate = formData.startDate ? new Date(formData.startDate.setHours(12, 0, 0, 0)).toISOString().split('T')[0] : null;
    const endDate = formData.endDate ? new Date(formData.endDate.setHours(12, 0, 0, 0)).toISOString().split('T')[0] : null;

    this.surp04Service.getReport(langCode, formData.reportName, formData.exportType, formData.actionlist, formData.systemList, startDate, endDate)
      .subscribe((response) => {
        this.saving = false;

        if (response) {
          const base64Data = response.trim();
          const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'ประวัติการเข้าถึงข้อมูลและระบบสารสนเทศ.xlsx';
          link.click();
        }
      }, (error) => {
        this.saving = false;
      });
  }
}
