import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0.5rem', visibility: 'hidden' })),
      transition('false <=> true', animate(225 + 'ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class CardComponent {
  @Input() styleBorder: string = '';
  @Input() header: string = '';
  @Input() isCollapsed: boolean = false;

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

}
