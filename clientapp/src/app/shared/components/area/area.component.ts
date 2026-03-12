import { Component, Input, SimpleChanges } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'areabox',
  templateUrl: './area.component.html'
})
export class AreaComponent extends BaseFormField {
  @Input() rows = 4;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) this.value = this.value ?? '';
  }

  override writeValue(text: string): void {
    this.value = text;
  }

  onTextChange($event: Event) {
    const value = ($event.target as HTMLTextAreaElement).value;
    this.onChange(value);
    this.value = value;
  }

  get displayText(): string {
    return String(this.value ?? '-');
  }

}
