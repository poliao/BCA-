import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

//ป้องกัน memoryleak
//ใช้กับ subscription ที่ไม่มี async pipe,ไม่ใช่ activate route,ไม่ใช่ httpclient call,ไม่ใช่ take(1),ไม่ใช่ first()
@Component({
  template: ''
})
export class SubscriptionDisposer implements OnDestroy {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}