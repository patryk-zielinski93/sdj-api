import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { SlackApiErrorsHandler } from '../services/slack-api-errors-handler';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    public auth: AuthService,
    private slackApiErrorHandler: SlackApiErrorsHandler
  ) {}

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
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body.error) {
          this.slackApiErrorHandler.handle(event.body.error);
        }
      })
    );
  }
}
