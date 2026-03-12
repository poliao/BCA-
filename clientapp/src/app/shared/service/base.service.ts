import { AbstractControl, FormGroup } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { FormValueTypes } from '../components/base-form';
import { RowState } from '../constants';

export class FormDatasource<M extends EntityBase> {
  id!: string;
  parentId!: string;
  model: M;
  form: FormGroup;
  formName: { [key: string]: FormGroup };
  private formGroup?: { [key: string]: FormGroup };

  constructor(model: M, form?: FormGroup, parentId?: string) {
    this.id = Guid.raw();
    this.parentId = parentId;
    this.model = model;

    if (!model.guid) this.model.guid = Guid.raw();
    if (model.rowState == null || model.rowState == undefined)
      this.model.rowState = RowState.Add;

    this.formGroup = {};
    if (form) this.createForm(form, this.id);
  }

  createForm(form: FormGroup, name: string = this.id): void {
    form.valueChanges.subscribe(() => {
      if (!form.pristine && this.model.rowState === RowState.Normal)
        this.model.rowState = RowState.Edit;
    });
    form.patchValue(this.model);
    this.formGroup[name] = form;
    if (name === this.id) this.form = this.formGroup[name];
    else Object.assign(this.formName, { name: this.formGroup[name] });
  }

  patchValue(name: string = this.id): void {
    this.formGroup[name]?.patchValue(this.model);
  }

  updateValue(): void {
    Object.values(this.formGroup).forEach(form => Object.assign(this.model, form.getRawValue()));
  }

  get valid(): boolean {
    return Object.values(this.formGroup).some(fg => fg.valid);
  }

  get invalid(): boolean {
    return Object.values(this.formGroup).some(fg => fg.invalid);
  }

  get dirty(): boolean {
    return Object.values(this.formGroup).some(fg => fg.dirty);
  }

  validate(): boolean {
    this.markAsTouched();
    return this.form.invalid;
  }

  reset(value?: FormValueTypes, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void {
    Object.values(this.formGroup).forEach(form => form.reset(value, options));
  }

  markAsTouched(): void {
    this.markFormGroupTouched(this.form);
  }

  private markFormGroupTouched(form: FormGroup): void {
    Object.values(form.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  markAsDirty(): void {
    Object.values(this.formGroup).forEach(form => this.markFormGroupDirty(form));
  }

  private markFormGroupDirty(form: FormGroup): void {
    Object.values(form.controls).forEach((control: AbstractControl) => {
      control.markAsDirty();
      if (control instanceof FormGroup) {
        this.markFormGroupDirty(control);
      }
    });
  }

  markAsPristine(): void {
    Object.values(this.formGroup).forEach(form => this.markFormGroupPristine(form));
  }

  private markFormGroupPristine(form: FormGroup): void {
    Object.values(form.controls).forEach((control: AbstractControl) => {
      control.markAsPristine();
      if (control instanceof FormGroup) {
        this.markFormGroupPristine(control);
      }
    });
  }

  get isNormal(): boolean {
    return this.model.rowState === RowState.Normal;
  }

  get isAdd(): boolean {
    return this.model.rowState === RowState.Add;
  }

  get isEdit(): boolean {
    return this.model.rowState === RowState.Edit;
  }

  get isDelete(): boolean {
    return this.model.rowState === RowState.Delete;
  }

  markToNormal(): void {
    this.model.rowState = RowState.Normal;
  }

  markForDelete(): void {
    this.model.rowState = RowState.Delete;
  }

  markToEdit(): void {
    this.model.rowState = RowState.Edit;
  }
}

export class EntityBase {
  guid: string;
  rowState: RowState;
  rowVersion: string;

  constructor() {
    this.guid = Guid.raw();
    this.rowState = RowState.Add;
  }

  get isAdd(): boolean {
    return this.rowState === RowState.Add;
  }

  get isEdit(): boolean {
    return this.rowState === RowState.Edit;
  }

  get isDelete(): boolean {
    return this.rowState === RowState.Delete;
  }

  markToNormal(): void {
    this.rowState = RowState.Normal;
  }

  markForDelete(): void {
    this.rowState = RowState.Delete;
  }

  markToEdit(): void {
    this.rowState = RowState.Edit;
  }
}

export class BaseList {
  guid: string;
  rowState: RowState;

  constructor() {
    this.guid = Guid.raw();
    this.rowState = RowState.Add;
  }
}
