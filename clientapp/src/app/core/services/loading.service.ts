import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export abstract class LoadingService {
  private isLoading = new Subject<boolean>();
  private loadingStack = [] as boolean[];
  isLoading$ = this.isLoading.asObservable();

  show(): void {
    this.loadingStack.push(true);
    this.isLoading.next(true);
  }

  hide(): void {
    if (this.loadingStack.length > 0) {
      this.loadingStack.pop();

      if (this.loadingStack.length === 0)
        this.isLoading.next(false);
    }
  }

  forceHide(): void {
    this.loadingStack = [];
    this.isLoading.next(false);
  }
}
