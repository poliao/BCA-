import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {DbEmployee} from './dbmt01.model';
import {FileService} from '@app/shared/service/file.service';

@Injectable()
export class Dbmt01Service {

  constructor(private http: HttpClient, private fs: FileService) {
  }

  getEmployees(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('dbmt01', {params: filter});
  }

  getEmployee(code: string) {
    return this.http.get<DbEmployee>('dbmt01/detail', {params: {employeeCode: code}});
  }

  getMaster(flag: string, companyCode: string) {
    return this.http.get<any>('dbmt01/master', {params: {flag: flag, companyCode: companyCode}});
  }

  save(program: DbEmployee, image) {
    let employees = this.fs.convertModelToFormData(program, {ImageFile: image})
    return this.http.post('dbmt01', employees);
  }

  delete(code: string, companyCode: string, version: string) {
    return this.http.delete('dbmt01', {params: {employeeCode: code, companyCode: companyCode, rowVersion: version}})
  }

  getDataDivision(divisionCode: string) {
    return this.http.get<any>('dbmt01/getDataDivision', {params: {divisionCode: divisionCode}});
  }
}
