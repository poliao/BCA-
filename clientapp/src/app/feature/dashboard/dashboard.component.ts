import { Component } from '@angular/core';
import { SystemCodes } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { ActionType } from '@app/core/model/action-type';
import { AuditTrailLog } from '@app/core/model/audit-trail-log';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private su: DashboardService) { }

  systemCodes: any[];
  defaultImage = 'https://i.imgur.com/JnJREXD.png';

  ngOnInit(): void {
    this.su.getSystemCode().subscribe((systemCodes) => {
      this.systemCodes = systemCodes;
      console.log(this.systemCodes);
      const referrer = this.getCookie('referrer');
      const to = this.getCookie('to');
      if (referrer === 'WT' && to) {
        const targetSystem = this.systemCodes.find((x: SystemCodes) => x.systemCode === to);
        if (targetSystem) {
          window.location.href = targetSystem.url;
        }
      }
    });
  }

  redirectPortal(url: string, systemCode: string): void {
    const parts = url.split('.');

    if (parts.length > 2) document.cookie = `referrer=WT; to=${systemCode}; domain=${parts.slice(parts.length - 2).join('.').replace(/^https?:\/\//, '').replace(/\//g, '')}; path=/; SameSite=None; Secure`;
    else document.cookie = `referrer=WT; to=${systemCode}; domain=${url.replace(/^https?:\/\//, '').replace(/\//g, '')}; path=/; SameSite=None; Secure`;
    window.location.href = url;
    localStorage.clear();
    sessionStorage.clear();
  }

  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }
}
