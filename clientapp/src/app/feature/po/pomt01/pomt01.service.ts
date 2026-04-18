import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pomt01 } from './pomt01.model';

@Injectable()
export class Pomt01Service {
  constructor(private http: HttpClient) { }

  getCategoryList(page: any, query: any) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('po/pomt01', { params: filter });
  }

  getAllCategories() {
    return this.http.get<Pomt01[]>('po/pomt01/categories/all');
  }

  getCategoryDetail(id: number) {
    return this.http.get<Pomt01>(`po/pomt01/detail`, { params: { id } });
  }

  getMaster() {
    return this.http.get<any>(`po/pomt01/master`);
  }

  save(category: any) {
    return this.http.post<Pomt01>('po/pomt01', category);
  }

  delete(id: number) {
    return this.http.delete(`po/pomt01`, { params: { id } });
  }
}
