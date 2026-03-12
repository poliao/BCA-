import { Component, Pipe, PipeTransform } from '@angular/core';
import { SystemCodes } from './rppm01.model';
import { Rppm01Service } from './rppm01.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  selector: 'app-rppm01',
  templateUrl: './rppm01.component.html',
  styleUrl: './rppm01.component.scss',
  providers: [SafeUrlPipe] 
})
export class Rppm01Component {
  constructor(private su: Rppm01Service) { }

  systemCode: any[];
  defaultImage = 'https://i.imgur.com/JnJREXD.png';

  canvaUrl: string;

  ngOnInit(): void {
    this.su.getSystemCode().subscribe((system) => {
      this.systemCode = system.systemCode;
      this.canvaUrl = system.userManualCanva.parameterValue;
      const referrer = this.getCookie('referrer');
      const to = this.getCookie('to');
      if (referrer === 'WT' && to) {
        const targetSystem = this.systemCode.find((x: SystemCodes) => x.systemCode === to);
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
    window.open(url, '_blank', 'noopener,noreferrer');
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
