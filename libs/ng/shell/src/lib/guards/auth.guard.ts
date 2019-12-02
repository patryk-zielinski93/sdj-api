import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService, SlackService } from '@sdj/ng/shared/app/core';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: AuthService,
    private router: Router,
    private slackService: SlackService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (code) {
      return this.slackService.getAccessToken(code).pipe(
        tap((response: any) => {
          this.loginService.setToken(response.access_token);
          this.router.navigate([], {
            queryParams: {
              code: null
            },
            queryParamsHandling: 'merge'
          });
        }),
        switchMap(() => of(true))
      );
    } else if (!this.loginService.isUserLogged()) {
      window.location.href = this.slackService.getSlackAuthorizationUrl();
    } else {
      return true;
    }
  }
}
