import { Component, Input } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'radio-checkbox',
  templateUrl: './radio-checkbox.component.html'
})
export class RadioCheckboxComponent extends BaseFormField {

  @Input() items = [];
  @Input() inline = true;

  override writeValue(obj: boolean): void {
    this.value = obj;
  }

  onSelect(item: { value: boolean }): void {
    if (this.value == item.value) {
      this.value = null;
    } else {
      this.value = item.value;
    }
    this.onChange(this.value);
  }

}
