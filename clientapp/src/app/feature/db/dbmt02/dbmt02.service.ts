
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dbposition } from './dbmt02.model';

@Injectable()
export class Dbmt02Service {
  constructor(private http: HttpClient) { }
  getPosiationList(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt02', { params: filter });
  }
  getPosiationDetail(code: string) {
    return this.http.get<Dbposition>('dbmt02/detail', { params: { PositionCode: code } });
  }
  getMaster() {
    return this.http.get<any>('dbmt02/master');
  }
  save(program: any) {
    return this.http.post('dbmt02', program);
  }
  delete(code: string, version: string) {
    return this.http.delete('dbmt02', { params: { PositionCode: code, rowVersion: version } })
  }
}
