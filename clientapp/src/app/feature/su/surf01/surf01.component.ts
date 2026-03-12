import { Component, OnInit } from '@angular/core';
import { Surf01Service } from './surf01.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { MessageService } from '@app/core/services/message.service';
import { LookupSource } from '@app/shared/components/lookup/lookup.source';
import { Surf01UserLookupComponent } from './surf01-user-lookup.component';
import { ModalService, Size } from '@app/shared/components/modal/modal.service';

@Component({
  selector: 'app-surf01',
  templateUrl: './surf01.component.html'
})
export class Surf01Component implements OnInit {

  radioItems = [{ value: 'pdf', text: 'PDF' }, { value: 'xlsx', text: 'EXCEL' }];
  userAuthorityType = [{ value: 'profile', text: 'ผู้ใช้งานตามกลุ่มสิทธิ์' }, { value: 'permission', text: 'ผู้ใช้งานตามสิทธิ์การเข้าถึงบริษัท' }];
  saving: boolean = false;
  base64: string = null;
  pdfUrl: SafeResourceUrl = null;
  userNameSource: LookupSource;
  master: any;
  reportForm: FormGroup;
  actions: any;

  constructor(
    private surf01Service: Surf01Service,
    private readonly route: ActivatedRoute,
    private fb: FormBuilder,
    public util: FormUtilService,
    private ms: MessageService,
    private modal: ModalService
  ) { }

  ngOnInit(): void {
    this.userNameSource = new LookupSource((term, value) => this.surf01Service.getUserLookUp(term, value));
    this.route.data.subscribe((data) => {
      this.master = data.surf01.master;
      this.actions = data.surf01.actions;
    });

    this.reportForm = this.fb.group({
      userNameFrom: [null],
      userNameTo: [null],
      departmentFrom:[null],
      departmentTo:[null],
      userAuthorityType: null,
      reportName: 'SURF01',
      exportType: ['pdf']
    });
    // this.reportForm.get('departmentTo').disable();

    // this.reportForm.get('departmentFrom')?.valueChanges.subscribe(value => {
    //   if (value && value !== '') {
    //     this.reportForm.get('departmentTo').enable();
    //     this.reportForm.get('departmentTo')?.setValidators([Validators.required]);
    //   }else {
    //     this.reportForm.get('departmentTo').disable();
    //     this.reportForm.get('departmentTo')?.clearValidators();
    //     this.reportForm.get('departmentTo').reset();
    //   }
    //   this.reportForm.get('departmentTo')?.updateValueAndValidity();
    // });

    this.reportForm.get('exportType')?.valueChanges.subscribe(value => {
      if (value === 'xlsx') {
        this.reportForm.get('userNameFrom')?.clearValidators();
        this.reportForm.get('userNameTo')?.clearValidators();
        this.reportForm.get('userAuthorityType')?.setValidators([Validators.required]);
        this.reportForm.get('departmentFrom').reset();
        this.reportForm.get('departmentTo').reset();
      } else {
        // this.reportForm.get('userNameFrom')?.setValidators([Validators.required]);
        // this.reportForm.get('userNameTo')?.setValidators([Validators.required]);
        this.reportForm.get('userAuthorityType')?.clearValidators();
      }
      this.reportForm.get('userNameFrom')?.updateValueAndValidity();
      this.reportForm.get('userNameTo')?.updateValueAndValidity();
      this.reportForm.get('userAuthorityType')?.updateValueAndValidity();
    });

  }

  getreport(): void {
    this.saving = true;
    if (this.reportForm.invalid) {
      this.util.markFormGroupTouched(this.reportForm);
      this.saving = false;
      return;
    }
    
    const formData = this.reportForm.value;
    this.surf01Service.getReport(formData)
      .subscribe((response) => {
        this.saving = false;

        if (response) {
          const base64Data = response.trim();
          const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Data}`;
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'รายงานแบบฟอร์มทบทวนข้อมูลผู้ใช้งานระบบ.' + formData.exportType;
          link.click();
        }
      }, (error) => {
        this.saving = false;
      }
      );
  }

  onOpenUserNameLookup = (value: any) => {
    return this.modal.open(Surf01UserLookupComponent, { keyword: value }, Size.Large);
  };

}
