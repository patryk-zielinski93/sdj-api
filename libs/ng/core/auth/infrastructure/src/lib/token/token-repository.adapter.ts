import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenRepository } from '@sdj/ng/core/auth/domain-services';
import { dynamicEnv } from '@sdj/ng/core/radio/domain';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TokenRepositoryAdapter extends TokenRepository {
  constructor(private http: HttpClient) {
    super();
  }

  getAccessToken(code: string): Observable<string> {
    return this.http
      .get<{ access_token: string }>('https://slack.com/api/oauth.access', {
        params: {
          client_id: dynamicEnv.slack.clientId,
          client_secret: dynamicEnv.slack.clientSecret,
          code,
          redirect_uri: window.location.origin
        }
      })
      .pipe(map(response => response.access_token));
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    window.localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
