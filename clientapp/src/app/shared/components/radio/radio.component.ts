import { Component, Input } from '@angular/core';
import { BaseFormField } from '../base-form';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'radio',
  templateUrl: './radio.component.html'
})
export class RadioComponent extends BaseFormField {

  @Input() items = [];
  @Input() inline = true;
  name = Guid.raw();

  override writeValue(obj: boolean): void {
    this.value = obj;
  }

  onSelect(value: boolean): void {
    this.onTouched();
    if (this.value != value) {
      this.value = value;
      this.onChange(value);
    }
  }
}
