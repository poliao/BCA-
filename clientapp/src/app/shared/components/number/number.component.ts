import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Big } from 'big.js';
import IMask, { InputMask } from 'imask';

import { FormControl } from '@angular/forms';
import { NullableMaskedNumber } from '@app/shared/extension/nullable-mask-number';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'number:not([currency])',
  templateUrl: './number.component.html'
})
export class NumberComponent extends BaseFormField {
  @Input() separator: boolean = true;
  @Input() set scale(value: number) {
    this.imask.scale = value;
    if (value > 0) {
      this.imask.padFractionalZeros = true;
      this.imask.normalizeZeros = false;
    }
  }
  get scale(): number {
    return this.imask.scale;
  }
  imask = {
    mask: NullableMaskedNumber,  // enable number mask
    // other options are optional with defaults below
    scale: 0,  // digits after point, 0 for integers
    signed: true,  // disallow negative
    thousandsSeparator: ',',  // any single char
    padFractionalZeros: false,  // if true, then pads zeros at end to the length of scale
    normalizeZeros: true,  // appends or removes zeros at ends
    radix: '.',  // fractional delimiter
    mapToRadix: ['.'],  // symbols to process as radix
    min: -99999999999999,
    max: 999999999999999
  };
  maskRef?: InputMask;
  displayText: string;
  private _initialValue: number | string;
  @ViewChild('textBox') textBox!: ElementRef<HTMLInputElement>;
  private _writing: boolean = false;
  private _writingValue: number | string;

  private initMask(): void {
    this.imask.thousandsSeparator = this.separator ? ',' : '';
    this.maskRef = IMask(this.element, this.imask)
      .on('accept', this._onAccept.bind(this))
  }

  get element(): HTMLInputElement {
    return this.textBox.nativeElement;
  }

  ngOnInit(): void {
    if (this.control) {
      const validatorMin = this.control?.validator?.(new FormControl(-1));
      const hasMin = Boolean(validatorMin?.hasOwnProperty('min'));
      if (hasMin) {
        this.imask.signed = false;
        this.imask.min = 0;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this._assignValue(changes.value.currentValue);
    }
  }

  override ngAfterViewInit(): void {
    this.initMask();
    if (this._initialValue != null) this._assignValue(this._initialValue);
    delete this._initialValue;
    super.ngAfterViewInit();
  }

  destroyMask(): void {
    if (this.maskRef) {
      this.maskRef.destroy();
      delete this.maskRef;
    }
  }

  ngOnDestroy(): void {
    this.destroyMask();
  }

  _assignValue(value: number | string): void {
    value = value !== null && value !== undefined ? Number(new Big(value).toFixed(0)) : null;
    if (this.maskRef) {
      this.beginWrite(value);
      this.maskValue = value;
      this.endWrite();
      this.displayText = this.maskRef.value ?? '-';
    }
    else {
      this._initialValue = value;
    }
  }

  override writeValue(value: number | string): void {
    this._assignValue(value);
  }

  get maskValue(): number {
    return this.maskRef.typedValue;
  }

  set maskValue(value: number) {
    if (this.maskRef) this.maskRef.typedValue = value;
  }

  beginWrite(value: number | string): void {
    this._writing = true;
    this._writingValue = value;
  }

  endWrite(): number | string {
    this._writing = false;
    return this._writingValue;
  }

  _onAccept(): void {
    const value = this.maskValue;
    if (this._writing && value === this.endWrite()) return;
    this.onChange(value);
  }
}
