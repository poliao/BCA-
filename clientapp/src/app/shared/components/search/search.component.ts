import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Input() value: any = '';
  @Input() placeholder = '';
  @Input() icon = 'fas fa-search';
  @Output() search = new EventEmitter<any>();

  onEnter(event: any) {
    this.value = event.target?.value;
    this.search.emit(this.value);
  }
}
