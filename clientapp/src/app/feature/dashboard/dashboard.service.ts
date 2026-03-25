import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SystemCodes } from './dashboard.model';
import { AuditTrailLog } from '@app/core/model/audit-trail-log';

@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }


  getCompany() {
    return this.http.get('company')
  }

  auditLogin(data: AuditTrailLog) {
    return this.http.post('AuditTrailLog', data);
  }

}
