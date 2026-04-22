import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qtmt01-post-print-dialog',
  templateUrl: './qtmt01-post-print-dialog.component.html',
  styles: [`
    .dialog-header {
      background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
      color: white;
      padding: 1rem 1.5rem;
      margin: -1.5rem -1.5rem 1.5rem -1.5rem;
    }
    .nav-pills .nav-link.active {
      background-color: #1a73e8;
    }
    .section-title {
      font-weight: 600;
      color: #3c4043;
      border-left: 4px solid #1a73e8;
      padding-left: 10px;
      margin-bottom: 15px;
    }
    .card-item {
      transition: all 0.2s;
      border: 1px solid #e0e0e0;
    }
    .card-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class Qtmt01PostPrintDialogComponent implements OnInit {
  form: FormGroup;
  master: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<Qtmt01PostPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = data.form;
    this.master = data.master;
  }

  ngOnInit(): void {
  }

  get coatings(): FormArray {
    return this.form.get('coatings') as FormArray;
  }

  get stampEntries(): FormArray {
    return this.form.get('stampEntries') as FormArray;
  }

  get gluings(): FormArray {
    return this.form.get('gluings') as FormArray;
  }

  // Coating Handlers
  addCoating() {
    this.coatings.push(this.fb.group({
      id: [null],
      isCutBeforeCoating: [false],
      coatingCutPieces: [null],
      coatingCutWidth: [null],
      coatingCutLength: [null],
      items: this.fb.array([])
    }));
    this.addCoatingItem(this.coatings.length - 1);
  }

  removeCoating(index: number) {
    this.coatings.removeAt(index);
  }

  getCoatingItems(coatingIndex: number): FormArray {
    return this.coatings.at(coatingIndex).get('items') as FormArray;
  }

  addCoatingItem(coatingIndex: number) {
    this.getCoatingItems(coatingIndex).push(this.fb.group({
      id: [null],
      coatingProcessId: [null, [Validators.required]],
      coatingNote: [null]
    }));
  }

  removeCoatingItem(coatingIndex: number, itemIndex: number) {
    this.getCoatingItems(coatingIndex).removeAt(itemIndex);
  }

  // Stamp Handlers
  addStampEntry() {
    const entry = this.fb.group({
      id: [null],
      stampProcessId: [null, Validators.required],
      stampSizeSelected: [null, Validators.required],
      batchNote: [null],
      items: this.fb.array([])
    });
    this.stampEntries.push(entry);
    this.addStampItem(this.stampEntries.length - 1);
  }

  removeStampEntry(index: number) {
    this.stampEntries.removeAt(index);
  }

  getStampItems(entryIndex: number): FormArray {
    return this.stampEntries.at(entryIndex).get('items') as FormArray;
  }

  addStampItem(entryIndex: number) {
    this.getStampItems(entryIndex).push(this.fb.group({
      id: [null],
      stampItemProcessId: [null, Validators.required],
      width: [null, [Validators.required, Validators.min(0.1)]],
      length: [null, [Validators.required, Validators.min(0.1)]],
      stampNote: [null]
    }));
  }

  removeStampItem(entryIndex: number, itemIndex: number) {
    this.getStampItems(entryIndex).removeAt(itemIndex);
  }

  // Gluing Handlers
  addGluing() {
    this.gluings.push(this.fb.group({
      id: [null],
      gluingProcessId: [null, [Validators.required]],
      gluingNote: [null]
    }));
  }

  removeGluing(index: number) {
    this.gluings.removeAt(index);
  }

  // Helpers for master data
  getStampSizeOptions(processId: number): any[] {
    if (!processId || !this.master.stampProcesses) return [];
    const proc = this.master.stampProcesses.find((p: any) => p.id === processId);
    if (!proc || !proc.pricingTiers) return [];
    const sizes = Array.from(new Set(proc.pricingTiers.map((t: any) => t.stampSize).filter((s: any) => s != null && s !== ''))).sort() as string[];
    return sizes.map(s => ({ value: s, text: s }));
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
