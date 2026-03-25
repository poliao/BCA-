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
    // getSystemCode and redirect logic removed per user request
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
