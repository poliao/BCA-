import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbSubDistrict } from './dbmt08-2.model';

@Injectable()
export class Dbmt082Service {

  constructor(private http: HttpClient) { }

  getSubDistrict(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt082', { params: filter });
  }

  getSubDistrictDetail(districtId, subDistrictId, subDistrictNameTHA) {
    return this.http.get<DbSubDistrict>('dbmt082/detail', { params: { DistrictId: districtId, SubDistrictId: subDistrictId, SubDistrictNameTHA:subDistrictNameTHA } });
  }

  getMaster() {
    return this.http.get<any>('dbmt08/master');
  }

  save(data: DbSubDistrict) {
    return this.http.post('dbmt082', data);
  }

  delete(code: number, version: number) {
    return this.http.delete('dbmt082', { params: { subDistrictId: code, rowVersion: version } })
  }

}
