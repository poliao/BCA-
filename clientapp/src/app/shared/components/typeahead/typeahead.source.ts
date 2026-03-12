import { BehaviorSubject, Observable, of } from "rxjs";
import { finalize, first, map, mergeMap, switchMap, tap } from "rxjs/operators";

export class TypeaheadSource {
  private readonly loadingSubject: BehaviorSubject<any>;
  private model: any;
  private suggestItems: any[];
  private loadedItems: any[];
  private cachedItem: any;
  private readonly onSearch: (term: string, value?: string | number) => Observable<any[]>;
  private readonly bindValue: string;
  private readonly orderProp: string;

  constructor(
    onSearch: (term: any, value?: number | string) => Observable<any[]>,
    bindValue: string = 'value',
    orderProp: string = 'text',
  ) {
    this.bindValue = bindValue;
    this.orderProp = orderProp;
    this.loadingSubject = new BehaviorSubject<any>(false);
    this.model = {};
    this.suggestItems = null;
    this.loadedItems = [];
    this.cachedItem = null;
    this.onSearch = onSearch;
  }

  getModel(value: number | string): Observable<any> {
    if (!value) {
      this.model = {};
      return of(this.model);
    }
    return this.handleValue(value);
  }

  private handleValue(value: number | string): Observable<any> {
    if (this.loadingSubject.getValue()) {
      return this.waitForLoading();
    }
    return this.processValue(value);
  }

  private waitForLoading(): Observable<any> {
    return this.loadingSubject.pipe(
      first(loading => loading === false),
      map(_ => this.model)
    );
  }

  private processValue(value: number | string): Observable<any> {
    if (Object.keys(this.model).length && this.model[this.bindValue] === value) {
      return of(this.model);
    }
    return this.findOrFetchModel(value);
  }

  private findOrFetchModel(value: number | string): Observable<any> {
    const item = (this.suggestItems || []).concat(this.loadedItems).find(item => item[this.bindValue] === value);
    if (item) {
      this.model = item;
      return of(this.model);
    } else {
      this.loadingSubject.next(true);
      return this.onSearch(null, value)
        .pipe(
          mergeMap(items => {
            this.model = items[0] || {};
            return of(this.model);
          }),
          finalize(() => this.loadingSubject.next(false))
        );
    }
  }

  getData(term: string): Observable<any[]> {
    if (!term) {
      if (this.suggestItems)
        return of(this.suggestItems);
      else return this.onSearch(null, null)
        .pipe(
          switchMap(items => {
            if (!this.cachedItem)
              this.suggestItems = items;
            else {
              const removeItems = items.filter(model => model[this.bindValue] !== this.cachedItem[this.bindValue]);
              removeItems.push(this.cachedItem);
              removeItems.sort((a, b) => {
                if (a[this.bindValue] === this.cachedItem[this.bindValue]) {
                  if (a[this.orderProp] > b[this.orderProp]) return 1;
                  if (a[this.orderProp] < b[this.orderProp]) return -1;
                }

                return 0;
              });
              this.suggestItems = removeItems;
            }
            return of(this.suggestItems);
          }),
        );
    }
    else return this.onSearch(term, null)
      .pipe(
        tap(items => {
          this.loadedItems = items
        }),
      );
  }

  clearItems(value: number | string): void {
    if (this.loadedItems?.length) {
      let current = this.loadedItems.find(item => item[this.bindValue] === value);
      if (!current) this.loadedItems = [];
    }
    if (this.suggestItems) {
      let current = this.suggestItems.find(item => item[this.bindValue] === value);
      if (!current) this.suggestItems = null;
    }
  }

  addItemToCache(model: any): void {
    if (Object.keys(model).length && !this.cachedItem)
      this.cachedItem = model;
  }

  clearCacheItems(): void {
    this.cachedItem = null;
  }
}
