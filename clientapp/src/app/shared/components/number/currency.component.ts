import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NullableMaskedNumber } from '@app/shared/extension/nullable-mask-number';
import IMask, { InputMask } from 'imask';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'number[currency]',
  templateUrl: './currency.component.html'
})
export class CurrencyComponent extends BaseFormField {
  @Input() padZero: boolean = true;
  @Input() scale: number = 2;
  imask = {
    mask: NullableMaskedNumber,  // enable number mask
    // other options are optional with defaults below
    scale: 2,  // digits after point, 0 for integers
    signed: true,  // disallow negative
    thousandsSeparator: ',',  // any single char
    padFractionalZeros: true,  // if true, then pads zeros at end to the length of scale
    normalizeZeros: true,  // appends or removes zeros at ends
    radix: '.',  // fractional delimiter
    mapToRadix: ['.'],  // symbols to process as radix
    min: -999999999999.99,
    max: 9999999999999.99,
  };
  maskRef?: InputMask;
  displayText: string;
  private _initialValue: number;
  @ViewChild('textBox') textBox!: ElementRef<HTMLInputElement>;
  private _writing: boolean = this.padZero;
  private _writingValue: number;

  private initMask(): void {
    this.imask.scale = this.scale;
    this.imask.min = -(10 ** (15 - this.scale) - 10 ** -this.scale);
    this.imask.max = 10 ** (15 - this.scale) - 10 ** -this.scale;
    this.imask.padFractionalZeros = this.padZero;
    this.maskRef = IMask(this.element, this.imask)
      .on('accept', this._onAccept.bind(this));
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
        this.imask.min = 0.00;
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

  ngAfterContentChecked(): void {
    this.displayText = this.maskRef?.value ?? '-'
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

  _assignValue(value: number): void {
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

  override writeValue(value: number): void {
    this._assignValue(value);
  }

  get maskValue(): number {
    return this.maskRef.typedValue;
  }

  set maskValue(value: number) {
    if (this.maskRef) this.maskRef.typedValue = value;
  }

  beginWrite(value: number): void {
    this._writing = true;
    this._writingValue = value;
  }

  endWrite(): number {
    this._writing = false;
    return this._writingValue;
  }

  _onAccept(): void {
    const value = this.maskValue;
    if (this._writing && value === this.endWrite()) return;
    this.onChange(value);
  }
}