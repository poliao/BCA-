import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageCriteria } from '@app/shared/components/datatable/page';
import { EntityBase } from '@app/shared/service/base.service';
import { delay, map, of } from 'rxjs';

const ELEMENT_DATA: any[] = [
  { value: '01', text: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { value: '01', text: 'Helium', weight: 4.0026, symbol: 'He' },
  { value: '01', text: 'Lithium', weight: 6.941, symbol: 'Li' },
  { value: '01', text: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { value: '01', text: 'Boron', weight: 10.811, symbol: 'B' },
  { value: '02', text: 'Carbon', weight: 12.0107, symbol: 'C' },
  { value: '02', text: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { value: '02', text: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { value: '02', text: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { value: '02', text: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

export class AttachmentDemo extends EntityBase {
  attachId: number;
  name: string;
  remark: string;
}

@Injectable()
export class InputService {

  constructor(private readonly http: HttpClient) { }

  getDependency(name: any, params: { code: any; }) {
    const examples = ELEMENT_DATA.filter(o => o.value === params.code);
    return of({ examples: examples, name: name })
  }

  getTypeahead(keyword: any, value: any) {
    return this.http.disableLoading().get<any>('demo/typeahead', { params: { keyword: keyword, value: value } });
  }

  getLookup(keyword: any, value: any) {
    const filter = { keyword: keyword, value: value, ...new PageCriteria('value') as any };
    return this.http.disableLoading()
      .get<any>('demo/lookup', { params: filter })
      .pipe(map(result => result.rows));
  }

  getLookupPage(page: any, query: any) {
    const filter = Object.assign(query, page);
    return this.http.get<any>('demo/lookup', { params: filter });
  }

  getGenerateInvoice(arInvoiceHead: any) {
    return this.http.post('ardt01/generateInvoice', arInvoiceHead);
  }

  saveTag(text: string) {
    return of({ value: Math.random(), text: text }).pipe(delay(100))
  }
}