import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityBase } from '@app/shared/service/base.service';
import { Observable } from 'rxjs';

export class SuUser extends EntityBase {
  id: number;
  userName: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  forceChangePassword: boolean;
  startEffectiveDate: Date;
  endEffectiveDate: Date;
  lastChangePassword: Date;
  passwordExpireDate: Date;
  lockoutEnd: string;
  lockoutEnabled: boolean;
  lockoutEnabledStatus: string;
  userType: string;
  updatedBy: string;
  updatedDate: Date;
  employeeCode: string;
  userProfiles: SuUserProfile[];
  userCompany: SuUserCompany[];
  
}

export class SuUserOrgUnits extends EntityBase {
  userId: number;
  companyCode: string;
  departmentCode: string;
  isSelected: boolean;
}

export class SuDepartmentDetail extends EntityBase {
  userId: number;
  userName: string;
  empName: string;
  companyName: boolean;
  companyCode: string;
  departments: SuUserOrgUnits[];
}

export class SuUserProfile extends EntityBase {
  profileCode: string;
}

export class SuUserCompany extends EntityBase {
  companyCode: string;
  isDefault: boolean;
}

@Injectable()
export class Sumt06Service {

  constructor(private http: HttpClient) { }

  getUsers(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('sumt06', { params: filter });
  }

  getUser(userId: number) {
    return this.http.get<SuUser>('sumt06/detail', { params: { userId: userId } });
  }

  getDepartment(companyCode: string) {
    return this.http.get<SuUser>('sumt06/department', { params: { companyCode: companyCode } });
  }

  getDepartmentDtail(companyCode: string, userId: number ) {
    return this.http.get<SuDepartmentDetail>('sumt06/departmentdetail', { params: {companyCode: companyCode, userId: userId } });
  }

  getMaster(page: string) {
    return this.http.get<any>('sumt06/master', { params: { page: page } });
  }

  getMasterDependency(name, params) {
    return this.http.get<any>('sumt06/dependency', { params: Object.assign({ name: name }, params) });
  }

  save(user: SuUser) {
    return this.http.post<any>('sumt06', user);
  }

  saveUserDepartment(user: SuDepartmentDetail) {
    return this.http.post<any>('sumt06/savedepartment', user);
  }

  delete(userId: number, version: string) {
    return this.http.delete('sumt06', { params: { userId: userId, rowVersion: version } })
  }

  resetPassword(userId: number, version: string) {
    return this.http.put<any>('sumt06/reset', { userId: userId, rowVersion: version })
  }

  forgetPassword(username) {
    return this.http.put('sumt06/forget', { username: username });
  }

  forceUpdatePassword(userId, username, isForce) {
    return this.http.put('sumt06/force', { userId: userId, username: username, isForce: isForce });
  }

  getCompanyLookupPage(page: any, query: any): Observable<any> {
    const filter = Object.assign(query, page);
    return this.http.get<any>('sumt06/companyLov', { params: filter });
  }

  ublockBruteForceUser(userName: string) {
    return this.http.delete('sumt06/unblock', { params: { UserName: userName} })
  }

}
