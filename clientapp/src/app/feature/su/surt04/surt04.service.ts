import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityBase } from '@app/shared/service/base.service';

export class SuConfiguration extends EntityBase {
  configGroupCode: string
  configCode:string
  configValue:string
  remark: string
}

@Injectable()
export class Surt04Service {

  constructor(private http: HttpClient) { }

  getConfigurations(page: any,query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('surt04', { params: filter });
  }

  getConfiguration(group:string,code:string) {
    return this.http.get<SuConfiguration>('surt04/detail', { params: { configGroupCode:group, configCode: code } });
  }

  getMaster() {
    return this.http.get<any>('surt04/master');
  }

  save(parameter: SuConfiguration) {
      return this.http.put('surt04', parameter);
  }

}
