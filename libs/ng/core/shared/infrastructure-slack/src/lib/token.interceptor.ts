import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthApiFacade } from '@sdj/ng/core/auth/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthApiFacade) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.auth.isUserLogged()) {
      request = request.clone({
        setParams: {
          token: this.auth.getToken()
        }
      });
    }
    return next.handle(request);
  }
}
