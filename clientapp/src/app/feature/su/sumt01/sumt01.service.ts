import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActionType } from '@app/core/model/action-type';
import { SuSystem } from './sumt01.model';

@Injectable()
export class Sumt01Service {

  constructor(private http: HttpClient) { }

  getSystems(page: any, query: string) {

    const filter = Object.assign(query, page);
    return this.http.get<any>('sumt01', { params: filter });
  }

  getSystem(code: string) {
    
    return this.http.get<SuSystem>('sumt01/detail', { params: { systemCode: code } });
  }

  getMaster() {
    
    return this.http.get<any>('sumt01/master');
  }

  save(program: SuSystem) {
    
    return this.http.post('sumt01', program);
  }

  delete(code: string, version: string) {
    
    return this.http.delete('sumt01', { params: { systemCode: code, rowVersion: version } })
  }

}
