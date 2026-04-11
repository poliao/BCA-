import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductionProcess } from './sumt03.model';

@Injectable()
export class Sumt03Service {

  constructor(private http: HttpClient) { }

  getProcesses(page: any, query: string) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('su/sumt03', { params: filter });
  }

  getProcess(id: number) {
    return this.http.get<ProductionProcess>('su/sumt03/detail', { params: { id: id } });
  }

  getMaster() {
    return this.http.get<any>('su/sumt03/master');
  }

  save(process: ProductionProcess) {
    return this.http.post('su/sumt03', process);
  }

  delete(id: any) {
    return this.http.delete('su/sumt03', { params: { id: id } })
  }

  // --- Process Group ---

  getGroups() {
    return this.http.get<any[]>('su/sumt03/group');
  }

  saveGroup(group: any) {
    return this.http.post('su/sumt03/group', group);
  }

  deleteGroup(id: any) {
    return this.http.delete('su/sumt03/group', { params: { id: id } });
  }

  // --- Production Location ---

  getLocations() {
    return this.http.get<any[]>('su/sumt03/location');
  }

  saveLocation(location: any) {
    return this.http.post('su/sumt03/location', location);
  }

  deleteLocation(id: any) {
    return this.http.delete('su/sumt03/location', { params: { id: id } });
  }
}
