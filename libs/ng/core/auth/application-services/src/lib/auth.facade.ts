import { Injectable } from '@angular/core';
import { TokenRepository } from '@sdj/ng/core/auth/domain-services';
import { Observable } from 'rxjs';

@Injectable()
export class AuthFacade {
  private token: string | null = null;

  constructor(private tokenRepository: TokenRepository) {
    this.token = tokenRepository.getToken();
  }

  isUserLogged(): boolean {
    return !!this.token;
  }

  getToken(): string {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    this.tokenRepository.setToken(token);
  }

  getAccessToken(code: string): Observable<string> {
    const source$ = this.tokenRepository.getAccessToken(code);
    source$.subscribe(token => this.setToken(token));
    return source$;
  }

  removeToken(): void {
    this.tokenRepository.removeToken();
  }
}
