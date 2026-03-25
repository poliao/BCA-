import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SuMenu } from './sumt01.model';

@Injectable()
export class Sumt01Service {

  constructor(private http: HttpClient) { }

  getMenus() {
    return this.http.get<SuMenu[]>('v1/menus');
  }

  getMenu(id: number) {
    return this.http.get<SuMenu>(`v1/menus/${id}`);
  }

  save(menu: SuMenu) {
    return this.http.post<SuMenu>('v1/menus', menu);
  }

  delete(id: number) {
    return this.http.delete(`v1/menus/${id}`);
  }
}
