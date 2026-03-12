import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbPrefix } from './dbmt06.model';
import { EntityBase } from '@app/shared/service/base.service';


@Injectable()
export class Dbmt06Service {
  constructor(private http: HttpClient) { }

  getPrefixs(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt06', { params: filter });
  }

  getPrefix(code: string) {
    return this.http.get<DbPrefix>('dbmt06/detail', { params: { PrefixId: code } });
  }

  getMaster() {
    return this.http.get<any>('dbmt06/master');
  }

  save(program: any) {
    return this.http.post('dbmt06', program);
  }

  delete(code: string, version: string) {
    return this.http.delete('dbmt06', { params: { PrefixId: code, rowVersion: version } })
  }
}
