import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Injector, Optional, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiPrefixInterceptor } from './api-prefix.interceptor';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';
import { HeaderInterceptor } from './header.interceptor';
import { LoadingInterceptor } from './loading.interceptor';

// HttpClient is declared in a re-exported module, so we have to extend the original module to make it work properly
// (see https://github.com/Microsoft/TypeScript/issues/13897)
declare module '@angular/common/http' {

  // Augment HttpClient with the added configuration methods from HttpService, to allow in-place replacement of
  // HttpClient with HttpService using dependency injection
  export interface HttpClient {
    /**
     * Skips default error handler for this request.
     * @return The new instance.
     */
    skipErrorHandler(): HttpClient;

    /**
     * Do not use API prefix for this request.
     * @return The new instance.
     */
    disableApiPrefix(): HttpClient;
    /**
        * Do not use block UI for this request.
        * @return The new instance.
        */
    disableLoading(): HttpClient;
    /**
    * Do not append header for this request.
    * @return The new instance.
    */
    disableHeader(): HttpClient;
    /**
    * Do not append bearer token header for this request.
    * @return The new instance.
    */
    disableAuthen(): HttpClient;
  }

}

// From @angular/common/http/src/interceptor: allows to chain interceptors
class HttpInterceptorHandler implements HttpHandler {

  constructor(private readonly next: HttpHandler, private readonly interceptor: HttpInterceptor) { }

  handle(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(request, this.next);
  }

}

/**
 * Allows to override default dynamic interceptors that can be disabled with the HttpService extension.
 * Except for very specific needs, you should better configure these interceptors directly in the constructor below
 * for better readability.
 *
 * For static interceptors that should always be enabled (ilike ApiPrefixInterceptor), use the standard
 * HTTP_INTERCEPTORS token.
 */
export const HTTP_DYNAMIC_INTERCEPTORS = new InjectionToken<HttpInterceptor>('HTTP_DYNAMIC_INTERCEPTORS');

/**
 * Extends HttpClient with per request configuration using dynamic interceptors.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService extends HttpClient {

  constructor(private readonly httpHandler: HttpHandler,
    private readonly injector: Injector,
    @Optional() @Inject(HTTP_DYNAMIC_INTERCEPTORS) private readonly interceptors: HttpInterceptor[] = []) {
    super(httpHandler);

    if (!this.interceptors) {
      // Configure default interceptors that can be disabled here
      this.interceptors = [
        this.injector.get(ApiPrefixInterceptor),
        this.injector.get(LoadingInterceptor),
        this.injector.get(ErrorHandlerInterceptor),
        this.injector.get(HeaderInterceptor),
      ];
    }
  }

  private encode(params: object) {
    Object.keys(params).forEach(key => {
      const value = params[key];
      const typeOfParam = typeof (value);
      if (value === null || value === undefined) {
        params[key] = '';
      }
      else if (value instanceof Date) {
        params[key] = value.toJSON();
      }
      else if (Array.isArray(value)) {
        value.forEach(v => this.encode(v))
      }
      else if (typeOfParam === 'object') {
        this.encode(value)
      }
    })
  }
  // Override the original method to wire interceptors when triggering the request.
  override request(method?: any, url?: any, options?: any): any {
    // Global API removal stub: Return empty or mock based on method/url if needed
    // For now, let's just log and return an empty observable to "remove" API calls
    console.log(`Intercepted API call: ${method} ${url}`);
    
    // If you want to keep some external APIs (like the GitHub demo one) or local assets
    if (url.includes('github.com') || url.includes('assets/')) {
       // Proceed with actual request
    } else {
       return of([]); // Return empty array for all local API calls
    }

    const handler = this.interceptors.reduceRight(
      (next, interceptor) => new HttpInterceptorHandler(next, interceptor),
      this.httpHandler
    );
    let params: HttpParams | undefined = undefined;
    if (options.params) {
      if (options.params instanceof HttpParams) {
        params = options.params;
      } else if (!options.params?.disableCustomEncode) {
        params = options.params;
        this.encode(params);
      }
      options.params = params;
    }

    return new HttpClient(handler).request(method, url, options);
  }

  override skipErrorHandler(): HttpClient {
    return this.removeInterceptor(ErrorHandlerInterceptor);
  }

  override disableApiPrefix(): HttpClient {
    return this.removeInterceptor(ApiPrefixInterceptor);
  }

  override disableLoading(): HttpClient {
    return this.removeInterceptor(LoadingInterceptor);
  }

  override disableHeader(): HttpClient {
    return this.removeInterceptor(HeaderInterceptor);
  }

  override disableAuthen(): HttpClient {
    return this; // Return self, doing nothing
  }

  private removeInterceptor(interceptorType: Type<HttpInterceptor>): HttpService {
    return new HttpService(
      this.httpHandler,
      this.injector,
      this.interceptors.filter(i => !(i instanceof interceptorType))
    );
  }

  private addInterceptor(interceptor: HttpInterceptor): HttpService {
    return new HttpService(
      this.httpHandler,
      this.injector,
      this.interceptors.concat([interceptor])
    );
  }

}
