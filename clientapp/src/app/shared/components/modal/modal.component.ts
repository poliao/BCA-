import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent {
  @Input() header: string;
  @Output() onClose = new EventEmitter<void>();

  close() {
    this.onClose.emit();
  }

}
