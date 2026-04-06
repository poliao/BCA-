import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuUser, SuRole, SuRolePermission } from './sumt02.model';
import { map, Observable } from 'rxjs';

@Injectable()
export class Sumt02Service {

  constructor(private http: HttpClient) { }

  getUsers(params: any): Observable<{ rows: any[], count: number }> {
    return this.http.get<any[]>('su/users', { params }).pipe(
      map(res => ({
        rows: res,
        count: res.length
      }))
    );
  }

  getUser(id: any) {
    return this.http.get<SuUser>(`su/users/${id}`);
  }

  saveUser(user: SuUser) {
    return this.http.post<SuUser>('su/users', user);
  }

  deleteUser(id: any, version: string) {
    return this.http.delete(`su/users/${id}`, { params: { rowVersion: version } });
  }

  getRoles() {
    return this.http.get<SuRole[]>('su/roles');
  }

  getRoleDetail(id: any) {
    return this.http.get<SuRole>(`su/roles/${id}`);
  }

  saveRole(role: SuRole) {
    return this.http.post<SuRole>('su/roles', role);
  }

  getPermissionTree(roleId: any) {
    return this.http.get<SuRolePermission[]>(`su/role-permissions/tree`, { params: { roleId: roleId || '' } });
  }

  getMaster() {
    return this.http.get<any>('su/sumt02/master');
  }
}
