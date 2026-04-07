import { DataSource } from "@angular/cdk/collections";
import { PageEvent } from "@angular/material/paginator";

import { BehaviorSubject, combineLatest, defer, filter, finalize, map, Observable, share, Subject, switchMap } from "rxjs";
import { Page, PageRequest, PaginatedEndpoint, Sort } from "./page";

export function prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> => defer(() => {
    callback();
    return source;
  });
}

export function indicate<T>(indicator: Subject<boolean>): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>): Observable<T> => source.pipe(
    prepare(() => indicator.next(true)),
    finalize(() => indicator.next(false)));
}

export interface SimpleDataSource<T> extends DataSource<T> {
  connect(): Observable<T[]>;
  disconnect(): void;
}

export class PaginatedDataSource<T, Q> implements SimpleDataSource<T> {
  public readonly reload: BehaviorSubject<boolean>;
  private readonly defaultSort: Sort<any>[];
  private readonly pageSort: BehaviorSubject<PageRequest<T>>;
  private readonly loading = new Subject<boolean>();

  public loading$ = this.loading.asObservable();
  public page$: Observable<Page<T>>;
  private query: Q = {} as Q;
  private currentData?: Page<T>;

  constructor(
    private readonly endpoint: PaginatedEndpoint<T, Q>,
    defaultPageSort: PageRequest<T>
  ) {
    this.reload = new BehaviorSubject<boolean>(false);
    this.defaultSort = defaultPageSort.sorts;
    this.pageSort = new BehaviorSubject<PageRequest<T>>(defaultPageSort);

    this.page$ = combineLatest([this.pageSort, this.reload.pipe(filter(load => load))])
      .pipe(
        switchMap(([pageSort, _]) => {
          const pageSortDto: PageRequest<T> = { ...pageSort };
          delete pageSortDto.sorts;
          return this.endpoint(pageSortDto, this.query)
            .pipe(
              indicate(this.loading),
              map(result => {
                this.currentData = { rows: result.rows, size: pageSort.size, number: pageSort.page, count: result.count } as Page<T>;
                return this.currentData;
              }));
        }),
        share());
  }

  sortBy(matSort: any): void {
    const lastPageSort = this.pageSort.getValue();
    const sorts: Sort<any>[] = matSort.direction == '' ? this.defaultSort : [{ property: matSort.active, direction: matSort.direction }];
    const nextPageSort: PageRequest<any> = { ...lastPageSort, sorts: sorts, sort: sorts.map(s => `${String(s.property)} ${s.direction}`).join(',') };
    this.pageSort.next(nextPageSort);
  }

  queryBy(query: Q, reset: boolean = false): void {
    this.query = query;
    if (reset) {
      this.fetch({ pageIndex: 0, pageSize: this.getPageInfo()?.size } as PageEvent)
    } else this.reload.next(true);
  }

  fetch(page: PageEvent): void {
    const lastPageSort = this.pageSort.getValue();
    const nextPageSort = { ...lastPageSort, ...{ page: page.pageIndex, size: page.pageSize } }
    this.pageSort.next(nextPageSort);
  }

  get data() {
    return this.currentData ? this.currentData.rows : [];
  }

  getPageInfo() {
    return this.pageSort.getValue();
  }

  get sortInfo(): Sort<any> {
    const pageInfo = this.getPageInfo();
    if (pageInfo?.sorts && pageInfo?.sorts?.length === 1) {
      return { property: pageInfo.sorts[0].property, direction: pageInfo.sorts[0].direction };
    }
    return { property: '', direction: 'asc' };
  }

  calculatePageAfterDelete() {
    const pageInfo = this.pageSort.getValue();
    const index = Math.min(Math.ceil((this.currentData.count - 1) / pageInfo.size) - 1, pageInfo.page);
    const page = new PageEvent();
    page.pageIndex = index < 0 ? 0 : index;
    page.pageSize = pageInfo.size;
    return page;
  }

  connect(): Observable<T[]> {
    return this.page$.pipe(map(page => page.rows));
  }

  disconnect(): void {
    // Method not implemented.
  }
}
