import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityBase } from '@app/shared/service/base.service';


export class SuPasswordPolicy extends EntityBase {
  passwordPolicyCode: string;
  passwordPolicyName: string;
  passwordPolicyDescription: string;
  passwordMinimumLength: number;
  passwordMaximumLength: number;
  failTime: number;
  passwordAge: number;
  maxDupPassword: number;
  usingUppercase: boolean;
  usingLowercase: boolean;
  usingNumericChar: boolean;
  usingSpecialChar: boolean;
}

@Injectable()
export class Sumt05Service {

  constructor(private http: HttpClient) { }

  getPolicies(page: any,query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('sumt05', { params: filter });
  }

  getPolicy() {
    return this.http.get<SuPasswordPolicy>('sumt05/detail', { params: {  } });
  }

  getMaster() {
    return this.http.get<any>('sumt05/master');
  }

  save(suMenu: SuPasswordPolicy) {
      return this.http.post('sumt05', suMenu);
  }

  delete(code:string, version:string) {
    return this.http.delete('sumt05', { params: { passwordPolicyCode: code, rowVersion: version } })
  }
}
