import { Component } from '@angular/core';

import { ModalService } from '@app/shared/components/modal/modal.service';
import { SubscriptionDisposer } from '@app/shared/components/subscription-disposer';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent extends SubscriptionDisposer {
  constructor(
    private readonly modal: ModalService,
  ) {
    super();
  }

  show(): void {
    // this.authService.getRole().subscribe((x) => console.log(x));

    // this.modal
    //   .open(DialogExampleComponent)
    //   .subscribe((value) => console.log(value));
    document.cookie = "referrer=WP; path=/";
    window.location.href = 'http://localhost:4300';
    localStorage.clear();
    sessionStorage.clear();
  }
}
