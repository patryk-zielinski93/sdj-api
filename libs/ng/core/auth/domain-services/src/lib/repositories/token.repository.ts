import { Observable } from 'rxjs';

export abstract class TokenRepository {
  abstract getAccessToken(code: string): Observable<string>;

  abstract getToken(): string | null;
  abstract setToken(token: string): void;

  abstract removeToken(): void;
}
