import { Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import IMask, { HTMLMaskElement, InputMask } from 'imask';
import { BaseFormField } from '../base-form';


@Component({
  selector: 'time',
  templateUrl: './time.component.html'
})
export class TimeComponent extends BaseFormField {
  imask = {
    mask: 'HH{:}MM',
    lazy: false,
    blocks: {
      HH: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 23
      },
      MM: {
        mask: IMask.MaskedRange,
        from: 0,
        to: 59
      }
    }
  };
  maskRef?: InputMask;
  displayText: string;
  private _initialValue: string;
  @ViewChild('time') time!: ElementRef<HTMLMaskElement>;
  private _writing: boolean = false;
  private _writingValue: string;

  private initMask(): void {
    this.maskRef = IMask(this.element, this.imask)
      .on('accept', this._onAccept.bind(this))
  }

  get element(): HTMLMaskElement {
    return this.time.nativeElement;
  }

  override ngAfterViewInit(): void {
    this.initMask();
    if (this._initialValue != null) this._assignValue(this._initialValue);
    delete this._initialValue;
    super.ngAfterViewInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this._assignValue(changes.value.currentValue);
    }
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

  _assignValue(value: string): void {
    value = (value || '').toString();
    const timeRegex = /\d{1,2}:\d{1,2}/;
    const match = timeRegex.exec(value);
    if (match) value = match[0];
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

  override writeValue(value: string): void {
    this._assignValue(value);
  }

  get maskValue(): string | null {
    return this.maskRef?.unmaskedValue ?? null;
  }

  set maskValue(value: string) {
    if (this.maskRef) this.maskRef.unmaskedValue = value;
  }


  beginWrite(value: string): void {
    this._writing = true;
    this._writingValue = value;
  }

  endWrite(): string {
    this._writing = false;
    return this._writingValue;
  }

  _onblur(): void {
    if (!this.maskRef?.masked.isComplete) {
      this.beginWrite(':');
      if (this.maskRef) this.maskRef.unmaskedValue = ':';
    }
    this.onTouched();
  }

  _onAccept(): void {
    const value = this.maskValue;
    if (this._writing && value === this.endWrite()) return;
    if (this.maskRef?.masked.isComplete) {
      this.onChange(value)
    }
    else {
      this.onChange(null)
    }
  }
}