import { Injectable, Injector } from '@angular/core';
import { HttpService } from '@app/core/http/http.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { mergeDeep } from './translate-http-loader';

@Injectable({
  providedIn: 'root'
})
export class LazyTranslationService {

  private lazyLoadedSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  lazyLoaded: Observable<string[]> = this.lazyLoadedSubject.asObservable();
  private modules: string[] = [];
  private loadedTranslate: { [key: string]: {} } = {};
  private loaded: boolean = false;

  get translationLoaded(): boolean {
    return this.loaded;
  }

  set translationLoaded(value: boolean) {
    this.loaded = value;
  }

  constructor(private injector: Injector) { }

  public add(module: string): void {
    // do not add if already added.
    if (this.modules.includes(module)) return;

    this.modules.push(module);
    if (this.loaded) {
      this.load(module);
    }
  }

  private load(module: string): void {
    const translate = this.injector.get(TranslateService);
    const langs = translate.langs?.length == 0 ? [translate.currentLang] : translate.langs;
    langs.forEach(lang => {
      this.retrieve(module, lang).pipe(
        finalize(() => this.lazyLoadedSubject.next(this.modules))
      ).subscribe(result => {
        this.loadedTranslate[lang] = mergeDeep(this.loadedTranslate[lang] ?? {}, result);
        translate.setTranslation(lang, result, true);
      })
    })
  }

  loadByLang(lang: string): Observable<string>[] {
    return this.modules.map(module => {
      return this.retrieve(module, lang);
    });
  }

  getLoadedTranslate(lang: string): { [key: string]: {} } {
    return this.loadedTranslate[lang] ?? {};
  }

  private retrieve(module: string, lang: string): Observable<any> {
    let http = this.injector.get(HttpService);
    return http.skipErrorHandler().disableHeader()
      .get(`localize/${module.toUpperCase()}/${lang.toUpperCase()}`)
      .pipe(catchError(_ => of({})))
  }
}
