import { Component, Input, SimpleChanges } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'radio-button',
  templateUrl: './radio-button.component.html'
})
export class RadioButtonComponent extends BaseFormField {

  @Input() items = [];
  @Input() inline = true;

  btnActiveClass = 'btn-';
  btnClass = 'btn-outline-';


  ngOnChanges(_: SimpleChanges): void {
    // changes.prop contains the old and the new value...
    this.items.forEach(item => {
      item.color = (item.color || 'main').toLocaleLowerCase();
      item.btnClass = item.color == 'monday' ? 'btn-outline-dark-' + item.color : this.btnClass + item.color;
      item.btnActiveClass = this.btnActiveClass + item.color;
    });
  }

  override writeValue(obj: string | number): void {
    this.value = obj;
  }

  onSelect(value: string | number): void {
    this.onTouched();
    if (this.value != value) {
      this.onChange(value);
      this.value = value;
    }
  }
}
