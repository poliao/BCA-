import { Component, Input } from '@angular/core';
import { StatusColor } from './color';


@Component({
  selector: 'status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {
  @Input() hasLabel: boolean = true;
  @Input() small: boolean = false;
  @Input() status: string = '';
  @Input() class: string = '';
  @Input() color: StatusColor = StatusColor.NORMAL;
}
