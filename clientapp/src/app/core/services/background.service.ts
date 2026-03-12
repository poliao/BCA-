import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  private showSignal = signal<boolean>(false);

  readonly status = computed(() => this.showSignal());

  setStatus(status: boolean): void {
    this.showSignal.set(status);
  }
  
}