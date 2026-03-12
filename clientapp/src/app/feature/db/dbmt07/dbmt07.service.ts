import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbCountry } from "@app/feature/db/dbmt07/dbmt07.model";


@Injectable()
export class Dbmt07Service {
  constructor(private http: HttpClient) { }

  getCountryList(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt07', { params: filter });
  }

  getCountry(code: string) {
    return this.http.get<DbCountry>('dbmt07/detail', { params: { countryCode: code } });
  }

  getMaster() {
    return this.http.get<any>('dbmt07/master');
  }

  save(program: any) {
    return this.http.post('dbmt07', program);
  }

  delete(code: string) {
    return this.http.delete('dbmt07', { params: { countryCode: code } })
  }
}
