import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { I18nService } from '@app/core/services/i18n.service';
import { Observable } from 'rxjs';

/**
 * Set user info header when requesting.
 */
@Injectable({
  providedIn: 'root',
})
export class HeaderInterceptor implements HttpInterceptor {

  constructor(
    @Inject('BASE_URL') private readonly baseUrl: string,
    private readonly i18n: I18nService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const reg = new RegExp(this.baseUrl);
    if (reg.test(request.url)) {
      let headers = {
        language: this.i18n.language || this.i18n.defaultLanguage,
      };
      
      return next.handle(request.clone({ setHeaders: headers }));
    }

    return next.handle(request);
  }
}
