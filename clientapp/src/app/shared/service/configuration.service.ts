import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { CacheService } from './cache-service';

type ContentPath = {
  DisplayUrl: string,
  ApiUrl: string,
}

@Injectable({ providedIn: 'root' })
export class ConfigurationService {

  constructor(private readonly http: HttpClient, private readonly cache: CacheService<ContentPath>) { }

  getConfiguration(group: string, code?: string): Observable<ContentPath> {
    let configuration$ = this.cache.getValue(`${group}|${code}`);
    if (!configuration$) {
      configuration$ = this.http.get<ContentPath>(`configuration/${group}/${code || ''}`).pipe(
        shareReplay(1)
      );
      this.cache.setValue(`${group}|${code}`, configuration$);
    }
    return configuration$;
  }
}
