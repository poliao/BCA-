import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dbdepartment} from './dbmt03.model';

@Injectable()
export class Dbmt03Service {
  constructor(private http: HttpClient) { }
  getDepartmentList(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt03', { params: filter });
  }
  getDepartment(code: string) {
    return this.http.get<Dbdepartment>('dbmt03/detail', { params: { departmentcode: code } });
  }
  getMaster() {
    return this.http.get<any>('dbmt03/master');
  }
  save(program: any) {
    return this.http.post('dbmt03', program);
  }
  delete(code: string, version: string) {
    return this.http.delete('dbmt03', { params: { departmentcode: code, rowVersion: version } })
  }
}
