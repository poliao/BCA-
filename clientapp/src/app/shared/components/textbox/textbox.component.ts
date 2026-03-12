import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'textbox',
  templateUrl: './textbox.component.html'
})
export class TextboxComponent extends BaseFormField {

  @Input() readonly = false;
  @Output() onBlur = new EventEmitter();
  @Input() preventSpace = true;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.value = this.value ?? '';
    }
  }

  override writeValue(value: string): void {
    this.value = value
  }

  onTextChange($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.onChange(value);
    if (this.required) {
      const notEmpty = new RegExp(/\S+/);
      if (notEmpty.test(value)) {
        this.removeErrors(['empty'], this.control);
        this.control?.updateValueAndValidity();
      }
      else {
        this.addErrors({ empty: true }, this.control);
      }
    }

    if (this.preventSpace) {
      const haveSpace = new RegExp(/(^\s+\S+|\S+\s+$)/);
      if (haveSpace.test(value)) {
        this.addErrors({ space: true }, this.control);
      }
      else if (this.control?.hasError('space')) {
        this.removeErrors(['space'], this.control);
        this.control?.updateValueAndValidity();
      }
    }
    this.value = value;
  }

  get displayText() {
    return this.value ?? '-';
  }

  onTextBlur() {
    this.onTouched();
    if (this.onBlur) {
      this.onBlur.emit();
    }
  }
}
