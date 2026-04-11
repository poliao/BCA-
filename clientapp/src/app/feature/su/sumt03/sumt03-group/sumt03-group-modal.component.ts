import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '@app/core/services/message.service';
import { FormUtilService } from '@app/shared/service/form-util.service';
import { Sumt03Service } from '../sumt03.service';

@Component({
  selector: 'app-sumt03-group-modal',
  templateUrl: './sumt03-group-modal.component.html'
})
export class Sumt03GroupModalComponent implements OnInit {
  form: FormGroup;
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<Sumt03GroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private su: Sumt03Service,
    private ms: MessageService,
    public util: FormUtilService
  ) {
    this.form = this.fb.group({
      id: [null],
      groupName: [null, [Validators.required, Validators.maxLength(100)]],
      displayOrder: [0, [Validators.required]],
      rowVersion: [null]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  save() {
    this.util.markFormGroupTouched(this.form);
    if (this.form.invalid) return;

    this.saving = true;
    this.su.saveGroup(this.form.value).subscribe({
      next: (res) => {
        this.ms.success('message.STD00006');
        this.dialogRef.close(res);
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
