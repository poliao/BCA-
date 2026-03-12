import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class Surp04Service {

  constructor(private http: HttpClient) { }

  getReport(
    langCode: string, 
    reportName: string, 
    exportType: string, 
    actionCode: string, 
    systemList: string, 
    startDate: string, 
    endDate: string
  ) {
    const body = {
      langCode: langCode,
      reportName: reportName,
      exportType: exportType,
      actionCode: actionCode,
      systemCode: systemList,
      startDate: startDate,
      endDate: endDate
    };
    
    return this.http.post<any>('Surp04/report', body, { responseType: 'text' as 'json' });
  }


  getMaster() {
    return this.http.get<any>('Surp04/master');
  }

}
