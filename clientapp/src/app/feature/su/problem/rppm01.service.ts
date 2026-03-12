import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rppm01Model, SystemCodes } from './rppm01.model';
import { AuditTrailLog } from '@app/core/model/audit-trail-log';

@Injectable()
export class Rppm01Service {

  constructor(private http: HttpClient) { }

  getSystemCode() {
    return this.http.get<Rppm01Model>('Rppm01');
  }
}
