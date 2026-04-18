import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pomt02 } from './pomt02.model';

@Injectable()
export class Pomt02Service {
  constructor(private http: HttpClient) { }

  getList(page: any, query: any) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('po/pomt02', { params: filter });
  }

  getDetail(id: number) {
    return this.http.get<Pomt02>(`po/pomt02/detail`, { params: { id } });
  }

  getMaster() {
    return this.http.get<any>(`po/pomt02/master`);
  }

  save(item: any) {
    return this.http.post<Pomt02>('po/pomt02', item);
  }

  delete(id: number) {
    return this.http.delete(`po/pomt02`, { params: { id } });
  }
}
