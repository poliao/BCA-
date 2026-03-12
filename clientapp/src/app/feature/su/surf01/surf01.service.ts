import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class Surf01Service {

  constructor(private http: HttpClient) { }

  getReport(formData) {
     return this.http.post<any>('Surf01/report', formData, { responseType: 'text' as 'json' });
    }

  getMaster() {
    return this.http.get<any>('Surf01/master');
  }
  
  getUserLookUp(keyword: string, value: string) {
    const filter = { keyword, value };
    return this.http.disableLoading()
      .get<any>('Surf01/user-lookup', { params: filter });
  }

  getPageUserLookUp(page: any, query: any) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('Surf01/user-lookup', { params: filter });
  }

}
