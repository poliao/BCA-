import { Component, Input } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'check-button',
  templateUrl: './check-button.component.html',
  styleUrls: ['./check-button.component.scss']
})
export class CheckButtonComponent extends BaseFormField {

  @Input() text: string = '';
  @Input() color!: string;
  btnActiveClass = 'btn-';
  btnClass = 'btn-outline-';

  ngOnInit(): void {
    this.color = (this.color || 'main').toLocaleLowerCase();
    this.btnClass = this.color == 'monday' ? 'btn-outline-dark-' + this.color : this.btnClass + this.color;
    this.btnActiveClass = this.btnActiveClass + this.color;
  }

  override writeValue(obj: boolean): void {
    this.value = obj;
  }

  onSelect(): void {
    this.value = !this.value;
    this.onChange(this.value);
    this.change.emit(this.value);
  }
}
