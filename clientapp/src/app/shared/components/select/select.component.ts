import { Component, Input, ContentChild, TemplateRef, Output, EventEmitter, } from '@angular/core';
import { BaseFormField } from '../base-form';

@Component({
  selector: 'select-input',
  templateUrl: './select.component.html'
})
export class SelectComponent extends BaseFormField {

  @Input() items: any[] | null = [];
  @Input() bindLabel = "text";
  @Input() bindValue = "value";
  @Input() bindDesc = "description";
  @Input() showDescription = false;
  @Input() multiple = false;
  @Input() addTag: any = false;
  @Input() groupBy?: string | ((value: any) => any);
  @Input() selectableGroup?: boolean = false;

  @Output() onAdd = new EventEmitter<any>();
  @Output() onRemove = new EventEmitter<any>();
  appendTo = 'Body'
  tag: any = false;
  customSearch?: (term: string, item: any) => boolean;
  @ContentChild('labelTemp') labelTemp!: TemplateRef<any>;
  @ContentChild('optionTemp') optionTemp!: TemplateRef<any>;

  ngOnInit(): void {
    if (this.addTag) this.tag = this.addTag;
    this.placeholder = this.placeholder ? this.placeholder : 'label.ALL.PleaseSelect'
    if (this.showDescription) {
      this.customSearch = this.searchFn;
    }
  }

  override writeValue(value: number | string): void {
    this.value = value;
  }

  onSelected(event: number | string): void {
    this.onChange(event);
    this.value = event;
  }

  searchFn = (term: string, item: any): boolean => {
    term = term.toLowerCase();
    return item[this.bindLabel].toLowerCase().indexOf(term) > -1 || item[this.bindDesc].toLowerCase().indexOf(term) > -1;
  }

  onAdded($event: number | string): void {
    this.onAdd.emit($event);
  }

  onRemoved($event: number | string): void {
    this.onRemove.emit($event);
  }

  get selectedText(): string {
    let item = this.items?.find(x => x[this.bindValue] == this.value);
    if (item) {
      return item[this.bindLabel];
    }
    return "-";
  }
}
