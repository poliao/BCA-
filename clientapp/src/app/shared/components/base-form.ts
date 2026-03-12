import { AfterViewInit, ChangeDetectorRef, Directive, DoCheck, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl, ValidationErrors } from '@angular/forms';
import { Guid } from 'guid-typescript';

export type FormValueTypes = string | number | boolean | Date | File | null;

@Directive()
export abstract class BaseFormField implements ControlValueAccessor, AfterViewInit, DoCheck {
  @Input() value: FormValueTypes = null;
  @Input() disabled: boolean = false;
  @Input() placeholder = '';
  @Input() hasLabel = true;
  @Input() small = true;
  @Input() class = '';
  @Output() change = new EventEmitter<FormValueTypes>();

  @ViewChild('editField') editField!: ElementRef;
  @ViewChild('viewField') viewField!: ElementRef;

  // generate a unique id for each control
  id = Guid.raw();
  required = false;


  onChange = (_: FormValueTypes) => { };
  onTouched = () => { };
  _ref = inject(ChangeDetectorRef);
  controlDir = inject(NgControl, { optional: true, self: true });

  constructor() {
    if (this.controlDir) {
      // bind the CVA to our control
      this.controlDir.valueAccessor = this
    }
  }

  ngAfterViewInit(): void {
    if (this.controlDir?.control) {
      let formControl = this.controlDir.control as FormControl & { editField: ElementRef, viewField: ElementRef, initilizeCallback: Function };

      formControl.editField = this.editField;
      formControl.viewField = this.viewField;

      if (formControl.initilizeCallback)
        formControl.initilizeCallback(formControl);
    }
    this._ref.detectChanges();
  }

  get control(): FormControl {
    return this.controlDir && this.controlDir.control instanceof FormControl ? this.controlDir.control : null;
  }

  ngDoCheck(): void {
    if (this.control) {
      // check if this field is required or not to display a 'required label'
      const validator = this.control.validator?.(new FormControl(''));
      this.required = validator?.['required'] ?? validator?.['selectedCount'] ?? false;
    }
  }

  get hasErrors(): ValidationErrors {
    return (this.control && (this.control.touched || this.control.dirty) && this.control.errors);
  }

  writeValue(_: FormValueTypes): void {
    /// implementation of `ControlValueAccessor`
  }

  registerOnChange(fn: (_: FormValueTypes) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled
  }

  removeErrors(keys: string[], control: AbstractControl): void {
    if (!control || !keys || keys.length === 0) return;

    const remainingErrors = keys.reduce((errors, key) => {
      delete errors[key];
      return errors;
    }, { ...control.errors });

    control.setErrors(remainingErrors);

    if (Object.keys(control.errors || {}).length === 0)
      control.setErrors(null);
  }

  addErrors(errors: { [key: string]: Object }, control: AbstractControl): void {
    if (!control || !errors) return;
    control.setErrors({ ...control.errors, ...errors });
  }
}
