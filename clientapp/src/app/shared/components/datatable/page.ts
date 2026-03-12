import { Observable } from "rxjs";

export interface Sort<T> {
  property: keyof T | any;
  direction: 'asc' | 'desc';
}

export interface PageRequest<T> {
  page: number;
  size: number;
  sorts?: Sort<any>[];
  sort: string;
}

export interface Page<T> {
  rows: T[];
  count: number;
  size: number;
  number: number;
}

export class PageCriteria implements PageRequest<any> {
  page: number;
  size: number;
  sorts?: Sort<any>[];
  sort: string;

  constructor(defaultSorts?: string, page: number = 0, size: number = 10) {
    this.page = page;
    this.size = size;

    if (defaultSorts) {
      const sorts = defaultSorts.split(',');
      this.sorts = sorts.map(s => {
        const sortString = s.split(' ');
        const sort: Sort<any> = { property: sortString[0], direction: sortString.length > 1 ? sortString[1] as ('asc' | 'desc') : 'asc' };
        return sort;
      });
      this.sort = this.sorts.map(s => `${String(s.property)} ${s.direction}`).join(',');
    }
  }
}

export type PaginatedEndpoint<T, Q> = (pageable: PageRequest<T>, query: Q) => Observable<any>;
