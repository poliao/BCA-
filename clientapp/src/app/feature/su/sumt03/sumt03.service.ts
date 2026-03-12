import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuMenu } from './sumt03.model';

@Injectable()
export class Sumt03Service {

  constructor(private http: HttpClient) { }

  getMenus(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('sumt03', { params: filter });
  }

  getMenu(code: string, systemCode: string) {
    return this.http.get<SuMenu>('sumt03/detail', { params: { menuCode: code, systemCode: systemCode } });
  }

  getMaster() {
    return this.http.get<any>('sumt03/master');
  }

  getMasterDependency(name: string, params: any) {
    return this.http.get<any>('sumt03/dependency', { params: { ...{ name: name }, ...params } });
  }

  save(suMenu: SuMenu) {
    return this.http.post('sumt03', suMenu);
  }

  delete(code: string, version: string) {
    return this.http.delete('sumt03', { params: { menuCode: code, rowVersion: version } })
  }
}
