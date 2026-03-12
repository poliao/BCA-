import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({ providedIn: 'root' })
export class CacheService<T> {

  readonly CACHE_DURATION_IN_MINUTES = 1440;

  private cache: {
    [id: string]: {
      expires: Date,
      value: Observable<T>
    }
  } = {};

  getValue(id: string): Observable<T> | null {
    const item = this.cache[id];
    if (!item) {
      return null;
    }

    if (new Date().getTime() > item.expires.getTime()) {
      delete this.cache[id];
      return null;
    }

    return item.value;
  }

  setValue(id: string, value: Observable<T>) {
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + this.CACHE_DURATION_IN_MINUTES);
    this.cache[id] = { expires, value };
  }

  clearCache() {
    this.cache = null;
  }
}