import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbDistrict } from './dbmt08-1.model';

@Injectable()
export class Dbmt081Service {

  constructor(private http: HttpClient) { }

  getDistrict(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt081', { params: filter });
  }

  getDistrictDetail(provinceId, districtId, districtNameTHA) {
    return this.http.get<DbDistrict>('dbmt081/detail', { params: { ProvinceId: provinceId, DistrictId: districtId, DistrictNameTHA:districtNameTHA } });
  }

  getMaster() {
    return this.http.get<any>('dbmt08/master');
  }

  save(data: DbDistrict) {
    return this.http.post('dbmt081', data);
  }

  delete(code: number, version: number) {
    return this.http.delete('dbmt081', { params: { districtId: code, rowVersion: version } })
  }

}
