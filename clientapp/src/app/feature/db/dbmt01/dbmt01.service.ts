import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DbLanguage, DbLocalization } from './dbmt01.model';

@Injectable()
export class Dbmt01Service {

  constructor(private http: HttpClient) { }

  getLanguages() {
    return this.http.get<DbLanguage[]>('languages');
  }

  save(language: DbLanguage) {
    return this.http.post<DbLanguage>('languages', language);
  }

  // Assuming we use standard isActive flag instead of hard delete for languages if needed,
  // but I'll add a placeholder if they want delete.
  delete(id: number) {
    return this.http.delete(`languages/${id}`);
  }

  getLocalizations(lang: string) {
    return this.http.get<DbLocalization[]>(`v1/localizations/${lang}`);
  }

  saveLocalizations(lang: string, localizations: DbLocalization[]) {
    return this.http.post<DbLocalization[]>(`v1/localizations/${lang}`, localizations);
  }
}
