import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bank } from './dbmt04.model';


@Injectable()
export class Dbmt04Service {
  constructor(private http: HttpClient) { }

  getBank(search: any, page: any) {
    const filter = Object.assign(search, page);
    return this.http.get<any>('dbmt04', { params: filter });
  }
  getBankDetail(code: string) {
    return this.http.get<any>('dbmt04/detail', { params: { BankCode: code } });
  }
  saveBank(bank: Bank) {
    if (bank.rowversion) {
      return this.http.put<Bank>('dbmt04/updatetBank', bank);
    } else {
      return this.http.post<Bank>('dbmt04/insertBank', bank);
    }
  }

  deleteBank(bankCode, version) {
    return this.http.delete('dbmt04/deleteBank', { params: { bankCode: bankCode, RowVersion: version } });
  }
}
