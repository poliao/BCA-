import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuCompany } from './sumt02.model';
import { ImageFile } from '@app/shared/components/attachment/image/image-file.model';
import { FileService } from '@app/shared/service/file.service';

@Injectable()
export class Sumt02Service {

  constructor(private http: HttpClient, private fs: FileService) { }

  getCompanies(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('sumt02', { params: filter });
  }

  getCompany(code: string) {
    return this.http.get<SuCompany>('sumt02/detail', { params: { companyCode: code } });
  }

  getDepartmentForBg(code: string) {
    return this.http.get<SuCompany>('sumt02/departmentForBg', { params: { companyCode: code } });
  }

  getMaster() {
    return this.http.get<any>('sumt02/master');
  }

  save(program: SuCompany, image) {
    let companys = this.fs.convertModelToFormData(program, {ImageFile: image})
    console.log('companys', companys);
    
    return this.http.post('sumt02', companys);
  }

  delete(code: string, version: string) {
    return this.http.delete('sumt02', { params: { companyCode: code, rowVersion: version } })
  }

}
