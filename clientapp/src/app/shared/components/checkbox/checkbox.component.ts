import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent extends BaseFormField {
  @Input() indeterminate = false;
  @Output() afterChange = new EventEmitter<boolean>();

  // ControlValueAccessor interface
  override writeValue(obj: boolean): void {
    this.value = obj;
  }

  onSelect(event: Event): void {
    this.value = (event.target as HTMLInputElement).checked;
    this.onChange(this.value);
    this.afterChange.emit(this.value);
  }
}
