import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, isDevMode } from '@angular/core';

import { map, Observable, of } from 'rxjs';

import { I18nService } from '@app/core/services/i18n.service';

import { AppConfigurationService } from '@app/core/services/app-configuration.service';

export enum ContentType {
  PDF = 'PDF',
  EXCEL = 'XLSX',
}

export type DefaultCriteria = {
  company_code: string;
  lin_id: string;
  user_name: string,
  ip_address: string
}

export type ReportParam = {
  paramsJson: Object;
  module: string;
  reportName: string;
  exportType: ContentType;
  autoLoadLabel?: string;
  fileName?: string;
}

export enum ViewOption {
  Download, Open
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(
    private http: HttpClient,
    private lang: I18nService,
    private config: AppConfigurationService,
    @Inject("REPORT_URL") private reportUrl: string
  ) { }

  private getFileNameFromResponseContentDisposition(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('content-disposition') || '';
    const matches = /filename=([^;]+)/ig.exec(contentDisposition);
    const fileName = (matches[1] || 'untitled').replace(/"/g, '').trim();
    return fileName;
  };

  private getContentType(response: HttpResponse<Blob>): string {
    return response.headers.get('content-type') || '';
  }

  private createUrl(resp: HttpResponse<Blob>, viewOption: ViewOption): void {
    const fileName = this.getFileNameFromResponseContentDisposition(resp);
    const type = this.getContentType(resp);

    const blob = new Blob([resp.body], { type: type });
    let blobUrl = URL.createObjectURL(blob);

    if (viewOption === ViewOption.Download) {
      let anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.target = '_blank';
      anchor.download = fileName;

      document.body.appendChild(anchor);
      anchor.click();

      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
    }

    if (viewOption === ViewOption.Open) {
      if (type !== 'application/pdf')
        throw new Error('Can only preview pdf file.');

      window.open(blobUrl, '_blank', 'noreferrer');
      URL.revokeObjectURL(blobUrl);
    }
  }

  /**
   * Get report from server
   * - use report server when available
   * - local report: `${environment.reportUrl}/exportReport`
   * - server report: `${this.config.config.ReportUrl}/exportReport`
   * @param param type ReportParam
   * @returns Observable<HttpResponse<Blob>>
   */
  private getReport(param: ReportParam): Observable<HttpResponse<Blob>> {
    const system: DefaultCriteria = {
      company_code: 'xxx',
      lin_id: this.lang.language?.toUpperCase() ?? this.lang.defaultLanguage.toUpperCase(),
      user_name: 'Guest',
      ip_address: ''
    };
    Object.assign(param.paramsJson, system);
    const url = !isDevMode() ? `${this.config.config.ReportUrl}/exportReport` : `${this.reportUrl}/exportReport`;
    return this.http.post(url, param, { responseType: 'blob', observe: 'response' }) as any;
  }

  previewReport(param: ReportParam): Observable<Blob> {
    if (param.exportType !== ContentType.PDF)
      throw new Error('Can only preview pdf file.');

    return this.getReport(param)
      .pipe(map(resp => new Blob([resp.body], { type: this.getContentType(resp) })));
  }

  downloadReport(param: ReportParam): Observable<void> {
    return this.getReport(param)
      .pipe(map(resp => this.createUrl(resp, ViewOption.Download)));
  }

  openReport(param: ReportParam): Observable<void> {
    if (param.exportType !== ContentType.PDF)
      throw new Error('Can only preview pdf file.');

    return this.getReport(param)
      .pipe(map(resp => this.createUrl(resp, ViewOption.Open)));
  }

  exportExcel(url: string, param: HttpParams): Observable<void> {
    return this.http.get(url, { params: param, responseType: 'blob', observe: 'response' })
      .pipe(map(resp => this.createUrl(resp, ViewOption.Download)));
  }

  formatDate(date: Date): string {
    if (!date) return null;
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear().toString();
    return [year, month, day].join('-');
  }
}
