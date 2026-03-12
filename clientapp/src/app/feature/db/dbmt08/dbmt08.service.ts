import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbProvince } from './dbmt08.model';

@Injectable()
export class Dbmt08Service {

  constructor(private http: HttpClient) { }

  getProvince(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt08', { params: filter });
  }

  getProvinceDetail(code: string) {
    return this.http.get<DbProvince>('dbmt08/detail', { params: { provinceNameTHA: code } });
  }

  getMaster() {
    return this.http.get<any>('dbmt08/master');
  }

  save(data: DbProvince) {
    return this.http.post('dbmt08', data);
  }

  delete(code: number, version: string) {
    return this.http.delete('dbmt08', { params: { provinceId: code, rowVersion: version } })
  }

}
