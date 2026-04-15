import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { I18nService } from '@app/core/services/i18n.service';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
    private readonly injector: Injector,
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const reg = new RegExp(this.baseUrl);
    if (reg.test(request.url)) {
      let headers: any = {
        language: this.i18n.language || this.i18n.defaultLanguage,
      };

      const authService = this.injector.get(AuthenticationService);
      const token = authService.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      return next.handle(request.clone({ setHeaders: headers })).pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const newToken = event.headers.get('New-Token');
            if (newToken) {
              authService.updateToken(newToken);
            }
          }
        })
      );
    }

    return next.handle(request);
  }
}
