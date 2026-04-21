import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaperCutService, CutResult } from './paper-cut.service';

@Component({
  selector: 'app-qtmt01-paper-cut-dialog',
  templateUrl: './qtmt01-paper-cut-dialog.component.html',
  styles: [`
    .sheet-preview {
      background: #f0f0f0;
      border: 1px solid #ccc;
      position: relative;
      margin: 0 auto;
      overflow: hidden;
    }
    .cut-box {
      border: 1px solid #1a73e8;
      background: rgba(26, 115, 232, 0.1);
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: #1a73e8;
      box-sizing: border-box;
    }
    .cut-box.rotated {
      background: rgba(232, 26, 26, 0.1);
      border-color: #d93025;
      color: #d93025;
    }
  `]
})
export class Qtmt01PaperCutDialogComponent implements OnInit {
  form: FormGroup;
  result: CutResult | null = null;
  scale = 10; // Pixels per unit (e.g. inch or cm)

  constructor(
    private fb: FormBuilder,
    private cutService: PaperCutService,
    private dialogRef: MatDialogRef<Qtmt01PaperCutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      parentW: [data.pw || 25, [Validators.required, Validators.min(1)]],
      parentL: [data.pl || 36, [Validators.required, Validators.min(1)]],
      childW: [data.cw || 12.5, [Validators.required, Validators.min(1)]],
      childL: [data.cl || 19, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.calculate();
    this.form.valueChanges.subscribe(() => this.calculate());
  }

  calculate() {
    const { parentW, parentL, childW, childL } = this.form.value;
    if (parentW && parentL && childW && childL) {
      this.result = this.cutService.calculateBestCut(parentW, parentL, childW, childL);
      this.updateScale();
    }
  }

  updateScale() {
    if (!this.result) return;
    const maxPreviewWidth = 600; 
    const maxPreviewHeight = 400;
    const scaleW = maxPreviewWidth / this.result.pw;
    const scaleL = maxPreviewHeight / this.result.pl;
    this.scale = Math.min(scaleW, scaleL, 15); // cap at 15 for visibility
  }

  onConfirm() {
    if (this.result) {
      this.dialogRef.close(this.result);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
