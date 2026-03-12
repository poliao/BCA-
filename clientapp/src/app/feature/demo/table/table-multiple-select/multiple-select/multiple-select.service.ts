import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable()
export class MultipleSelectService {

  constructor(private http: HttpClient) { }

  getLookupPage(page: any, query: any): Observable<any> {
    const filter = Object.assign(query, page);
    return this.http.get<any>('demo/lookup', { params: filter });
  }

}