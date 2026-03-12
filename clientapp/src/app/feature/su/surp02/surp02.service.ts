import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { map } from 'rxjs';

@Injectable()
export class Surp02Service {

  constructor(private http: HttpClient) { }

  getReport(reportForm: any) {
    const param = {
      reportName: reportForm.reportName,
      exportType: reportForm.exportType,
      companyCodeFrom: reportForm.companyCodeFrom,
      companyCodeTo: reportForm.companyCodeTo,
      userNameFrom: reportForm.userNameFrom,
      userNameTo: reportForm.userNameTo,
      active: reportForm.active,
    };
    return this.http.post<any>('Surp02/report', param, { responseType: 'text' as 'json' });
  }

  getMaster() {
    return this.http.get<any>('Surp02/master');
  }

  getUserLookUp(keyword: string, value: string) {
    const filter = { keyword, value };
    return this.http.disableLoading()
      .get<any>('Surp02/user-lookup', { params: filter });
  }

  getPageUserLookUp(page: any, query: any) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('Surp02/user-lookup', { params: filter });
  }

}
