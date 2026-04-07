import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbLanguage, DbLocalization } from './dbmt01.model';

@Injectable()
export class Dbmt01Service {

  constructor(private http: HttpClient) { }

  getLanguages(params?: any) {
    return this.http.get<{ rows: DbLanguage[], count: number }>('languages', { params });
  }

  save(language: DbLanguage) {
    return this.http.post<DbLanguage>('languages', language);
  }

  // Assuming we use standard isActive flag instead of hard delete for languages if needed,
  // but I'll add a placeholder if they want delete.
  delete(id: number) {
    return this.http.delete(`languages/${id}`);
  }

  getLocalizations(lang: string, params?: any) {
    return this.http.get<{ rows: DbLocalization[], count: number }>(`v1/localizations/${lang}`, { params });
  }

  saveLocalizations(lang: string, localizations: DbLocalization[]) {
    return this.http.post<DbLocalization[]>(`v1/localizations/${lang}`, localizations);
  }
}
