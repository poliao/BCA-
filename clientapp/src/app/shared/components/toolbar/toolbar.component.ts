import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  host: {
    class: '_toolbar'
  }
})
export class ToolbarComponent {
  @Input() showBack: boolean = true;
  constructor(private readonly location: Location) { }

  back(): void {
    this.location.back();
  }
}
