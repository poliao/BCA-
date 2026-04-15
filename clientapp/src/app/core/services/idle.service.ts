import { Injectable, NgZone } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout = 15 * 60 * 1000; // 15 minutes
  private warningTime = 14 * 60 * 1000; // 14 minutes
  private lastActivity: number = Date.now();
  private activitySubscription: Subscription | null = null;
  private intervalId: any;
  private warningShown = false;

  constructor(
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private ngZone: NgZone
  ) { }

  startWatching() {
    if (this.activitySubscription) {
      return;
    }

    this.lastActivity = Date.now();
    
    this.ngZone.runOutsideAngular(() => {
      this.activitySubscription = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'click'),
        fromEvent(document, 'touchstart'),
        fromEvent(document, 'scroll')
      ).subscribe(() => {
        this.resetTimer();
      });

      this.intervalId = setInterval(() => {
        this.checkIdleTime();
      }, 1000);
    });
  }

  stopWatching() {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
      this.activitySubscription = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private resetTimer() {
    this.lastActivity = Date.now();
    if (this.warningShown) {
      this.ngZone.run(() => {
        this.warningShown = false;
        this.toastr.clear();
      });
    }
  }

  private checkIdleTime() {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    const idleTime = Date.now() - this.lastActivity;

    if (idleTime >= this.idleTimeout) {
      this.ngZone.run(() => {
        this.toastr.clear();
        this.toastr.error('Your session has expired due to inactivity.', 'Session Expired');
        this.authService.logout();
      });
    } else if (idleTime >= this.warningTime && !this.warningShown) {
      this.warningShown = true;
      this.ngZone.run(() => {
        this.toastr.warning('Your session will expire in 1 minute due to inactivity. Move your mouse or press any key to extend it.', 'Session Expiring', {
          timeOut: 60000,
          extendedTimeOut: 60000,
          closeButton: true
        });
      });
    }
  }
}
