import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { LoadingService } from '@app/core/services/loading.service';
import { MessageService } from '@app/core/services/message.service';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type HandledError = {
  status: number;
  message: string;
}

export type ErrorModel = {
  code: string,
  parameters: string[]
}

/**
 * Adds a default error handler to all requests.
*/
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private message: MessageService,
    private loading: LoadingService,
    private injector: Injector,
    @Inject('BASE_URL') private baseUrl: string
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const reg = new RegExp(this.baseUrl);
    if (reg.test(request.url)) {
      return next.handle(request).pipe(catchError(error => this.handleError(error)));
    } else return next.handle(request);
  }

  // Customize the default error handler here if needed
  private handleError(errorResponse: HttpErrorResponse): Observable<HttpEvent<any>> {
    this.loading.forceHide();
    if (errorResponse.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      this.message.error(errorResponse.message);
    }
    else {
      this.handleBackendError(errorResponse);
    }

    const errer: HandledError = { status: errorResponse.status, message: errorResponse.message }
    return throwError(() => errer);
  }

  private handleBackendError(errorResponse: HttpErrorResponse): void {
    switch (errorResponse.status) {
      case 504: this.message.error(`Please check the connection`);
        this.message.error('Gateway Timeout');
        break;
      case 403: this.message.warning(`You don't have access to the url : ${errorResponse.url}`);
        break;
      case 401:
        this.message.warning(`Session expired. Please log in again.`);
        this.injector.get(AuthenticationService).logout();
        break;
      case 500: this.message.error(errorResponse.error.code);
        break;
      case 400:
      case 404: {
        const backendError = errorResponse.error;
        if (!backendError.code && errorResponse.status == 404) {
          this.message.error(`The requested URL(${errorResponse.url}) was not found on this server`);
        }
        else if (backendError.errors) {
          if (backendError.single) {
            forkJoin((backendError.errors as ErrorModel[]).map((item: ErrorModel) => this.message.translatedMessage(item.code, item.parameters))).subscribe((translates: string[]) => {
              this.message.errorConcat(translates.join("<br>"));
            })
          }
          else (backendError.errors as ErrorModel[]).forEach((item: ErrorModel | string) => {
            if (typeof item === 'object') this.message.error(item.code, item.parameters)
            else {
              let errorMessage = item;
              this.message.error(errorMessage);
            }
          });
        }
        else if (backendError.code) {
          this.message.error(backendError.code, backendError.parameters);
        }
        else if (backendError instanceof Blob) {
          backendError.text().then(err => {
            const error = JSON.parse(err);
            if (error.errors) {
              (error.errors as any[]).forEach(item => {
                this.message.error(item);
              });
            }
          });
        }
        else if ((backendError as string).includes('code')) {
          const message = JSON.parse(backendError);
          this.message.error(message.code, message.parameters);
        }
        else this.message.error(backendError);
        break;
      }
    }
  }

}
