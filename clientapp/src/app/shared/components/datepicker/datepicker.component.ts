import { Component, ElementRef, Input, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDatepickerInput } from '@angular/material/datepicker';

import { DateAdapter } from '@angular/material/core';
import { I18nService, SupportedLanguages } from '@app/core/services/i18n.service';
import IMask, { FactoryArg, HTMLMaskElement, InputMask } from 'imask';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent extends BaseFormField {
  private readonly defaultMin = new Date(1754, 0, 1);
  private readonly defaultMax = new Date(9999, 11, 31);
  @Input() min: Date = this.defaultMin;
  @Input() max: Date = this.defaultMax;
  @Input() filter: (date: Date) => boolean = ((_: Date) => true);

  get offsetYear(): number {
    return this.lang.language == SupportedLanguages.Thai ? 543 : 0;
  }

  imask = {
    mask: Date,  // enable date mask
    min: this.defaultMin,  // defaults to `1900-01-01`
    max: this.defaultMax,  // defaults to `9999-01-01`
    // other options are optional
    pattern: 'd/`m/`Y',  // Pattern mask with defined blocks, default is 'd{.}`m{.}`Y'
    // you can provide your own blocks definitions, default blocks for date mask are:
    blocks: {
      d: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 31,
        maxLength: 2,
      },
      m: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
        maxLength: 2,
      },
      Y: {
        mask: IMask.MaskedRange,
        from: 1754,
        to: 9999,
      }
    },
    autofix: false,
    lazy: false,
    // define date -> str convertion
    format: (_: Date) => {
      return '';
    },
    // define str -> date convertion
    parse: (_: string) => {
      return new Date();
    },
  };

  private _writing: boolean = false;
  private _writingValue: Date;
  maskRef?: InputMask<FactoryArg>;
  displayText: string;
  private _initialValue: Date;
  @ViewChild('inputDate') inputDate!: ElementRef<HTMLMaskElement>;
  @ViewChild(MatDatepickerInput) datepickerInput!: MatDatepickerInput<Date>;

  constructor(public lang: I18nService, private readonly _adapter: DateAdapter<Date>) { super() }

  private initMask(): void {
    this.imask.format = (date: Date): string => {
      if (date) {
        let day: string | number = date.getDate();
        let month: string | number = date.getMonth() + 1;
        let year = date.getFullYear() + this.offsetYear;
        if (day < 10) day = "0" + day;
        if (month < 10) month = "0" + month;
        return [day, month, year].join('/');
      }
      return null;
    }
    this.imask.parse = (str: string): Date => {
      const yearMonthDay = str.split('/');
      return new Date(parseInt(yearMonthDay[2]) - this.offsetYear, parseInt(yearMonthDay[1]) - 1, parseInt(yearMonthDay[0]));
    }
    this.maskRef = IMask(this.element, this.imask)
      .on('accept', this.onAccept.bind(this))
  }

  destroyMask(): void {
    if (this.maskRef) {
      this.maskRef.destroy();
      delete this.maskRef;
    }
  }

  override ngAfterViewInit(): void {
    let locale: string;
    switch (this.lang.language) {
      case 'cn': locale = 'zh-Hans'
        break;
      case 'kr': locale = 'ko'
        break;
      default: locale = this.lang.language
        break;
    }

    this._adapter.setLocale(locale);
    this.initMask();
    if (this._initialValue != null) this._assignValue(this._initialValue);
    delete this._initialValue;
    super.ngAfterViewInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['min']) {
      this.changeMin(changes);
    }
    else if (changes['max']) {
      this.changeMax(changes);
    }
    else if (changes['value']) {
      if (changes['value']) {
        this._assignValue(changes['value'].currentValue);
      }
    }
  }

  private changeMin(changes: SimpleChanges): void {
    let minDate!: Date;
    if (changes['min'].currentValue) {
      minDate = changes['min'].currentValue instanceof Date ? changes['min'].currentValue : new Date(changes['min'].currentValue);
    }
    else {
      minDate = this.defaultMin;
    }
    minDate.setHours(0, 0, 0, 0);
    this.imask.min = minDate;
    if (this.maskRef) this.maskRef.updateOptions(this.imask);
  }

  private changeMax(changes: SimpleChanges): void {
    let maxDate!: Date;
    if (changes['max'].currentValue) {
      maxDate = changes['max'].currentValue instanceof Date ? changes['max'].currentValue : new Date(changes['max'].currentValue);
    }
    else {
      maxDate = this.defaultMax;
    }
    maxDate.setHours(0, 0, 0, 0);
    this.imask.max = maxDate;
    if (this.maskRef) this.maskRef.updateOptions(this.imask);
  }

  getNativeDateAdaptorFormat(date: Date): string {
    if (date) {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return [month, day, year].join('/');
    }
    return '';
  }

  _assignValue(value: Date | string): void {
    value = value ? new Date(value) : null;
    if (value) value.setHours(0, 0, 0, 0);
    if (this.maskRef) {
      this.beginWrite(value);
      this.maskValue = value;
      this.endWrite();
      this.datepickerInput._onInput(this.getNativeDateAdaptorFormat(value));
      this.displayText = this.maskRef.value ?? '-';
    }
    else {
      this._initialValue = value;
    }
  }

  override writeValue(value: Date): void {
    this._assignValue(value);
  }

  ngOnDestroy() {
    this.destroyMask();
  }

  get element() {
    return this.inputDate.nativeElement;
  }
  get maskValue(): Date {
    return this.maskRef?.typedValue;
  }

  set maskValue(value: Date) {
    if (this.maskRef) {
      if (value) this.maskRef.typedValue = value;
      else this.maskRef.unmaskedValue = '';
    }
  }

  beginWrite(value: Date): void {
    this._writing = true;
    this._writingValue = value;
  }

  endWrite(): Date {
    this._writing = false;
    return this._writingValue;
  }

  onblur(): void {
    const value = this.maskValue;
    if (value == null) {
      this.beginWrite(value);
      this.maskValue = value;
      this.endWrite();
    }
    this.onTouched();
  }

  onAccept(): void {
    const value = this.maskValue;
    if (this._writing && this.equal(value, this.endWrite())) return;
    this.onChange(value);
    this.datepickerInput._onInput(this.getNativeDateAdaptorFormat(value));
  }

  equal(first: Date, second: Date): boolean {
    if (first?.valueOf() == second?.valueOf() || (!first && !second)) return true;
    else return false;
  }

  pickerChange(value: Date): void {
    this.maskValue = value;
  }

}
