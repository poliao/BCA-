import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Qtmt01 } from './qtmt01.model';


@Injectable()
export class Qtmt01Service {
  constructor(private http: HttpClient) { }

  getQuotations(page: any, query: any) {
    const params = {
      ...page,
      keyword: query.keyword || ''
    };
    return this.http.get<any>('qt/qtmt01', { params });
  }

  getQuotation(id: any) {
    return this.http.get<Qtmt01>(`qt/qtmt01/${id}`);
  }

  getMaster() {
    return this.http.get<any[]>('qt/qtmt01/master');
  }

  save(data: any) {
    return this.http.post('qt/qtmt01', data);
  }

  delete(id: any) {
    return this.http.delete(`qt/qtmt01/${id}`);
  }

  searchRDContact(keyword: string) {
    return this.http.get<any>(`qt/qtmt01/rd-contact`, { params: { keyword } });
  }
}
