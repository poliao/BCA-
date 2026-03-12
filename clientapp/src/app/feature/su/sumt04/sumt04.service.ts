import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuProfile } from './sumt04.model';

@Injectable()
export class Sumt04Service {

  constructor(private http: HttpClient) { }

  getProfiles(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('sumt04', { params: filter });
  }

  getProfile(code: string) {
    return this.http.get<SuProfile>('sumt04/detail', { params: { profileCode: code } });
  }

  getMaster() {
    return this.http.get<any>('sumt04/master');
  }

  getMenus(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('sumt04/menu', { params: filter });
  }

  save(profile: SuProfile) {
    return this.http.post('sumt04', profile);
  }

  delete(code: string, version: string) {
    return this.http.delete('sumt04', { params: { profileCode: code, rowVersion: version } })
  }

  copy(model) {
    return this.http.post('sumt04/copy', model);
  }
}
