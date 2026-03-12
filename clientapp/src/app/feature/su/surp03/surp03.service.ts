import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class Surp03Service {

  constructor(private http: HttpClient) { }

  getReport(formData) {
    return this.http.post<any>('Surp03/report', formData, { responseType: 'text' as 'json' });
  }

  getMaster() {
    return this.http.get<any>('Surp03/master');
  }
}
