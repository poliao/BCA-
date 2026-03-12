import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-showImg',
  templateUrl: './showImg.component.html'
})
export class ShowImgComponent {
  imgData: string;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ShowImgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Object,
    private readonly fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      imgData: this.data,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
