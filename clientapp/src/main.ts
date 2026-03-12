import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { environment } from '@env/environment';

export function removeSlash(url: string) {
  const last = url.charAt(url.length - 1);
  return last === '/' ? url.slice(0, -1) : url;
}

export function getBaseUrl() {
  return environment.production ? removeSlash(document.getElementsByTagName('base')[0].href) : environment.apiUrl;
}

export function getClientUrl() {
  return removeSlash(document.getElementsByTagName('base')[0].href);
}

export function getReportUrl() {
  return removeSlash(environment.reportUrl);
}

const providers = [
  { provide: 'CLIENT_URL', useFactory: getClientUrl, deps: [] },
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
  { provide: 'REPORT_URL', useFactory: getReportUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
