import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbBankAccountType } from './dbmt05.model';
import { EntityBase } from '@app/shared/service/base.service';


@Injectable()
export class Dbmt05Service {
  constructor(private http: HttpClient) { }

  getBankAccountTypes(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt05', { params: filter });
  }

  getBankAccountType(code: string) {
    return this.http.get<DbBankAccountType>('dbmt05/detail', { params: { BankAccountTypeCode: code } });
  }

  getMaster() {
    return this.http.get<any>('dbmt05/master');
  }

  save(program: any) {
    return this.http.post('dbmt05', program);
  }

  delete(code: string, version: string) {
    return this.http.delete('dbmt05', { params: { BankAccountTypeCode: code, rowVersion: version } })
  }
}
