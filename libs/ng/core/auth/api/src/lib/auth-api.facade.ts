import { Injectable } from '@angular/core';
import { AuthFacade } from '@sdj/ng/core/auth/application-services';

@Injectable()
export class AuthApiFacade {
  constructor(private authFacade: AuthFacade) {}

  isUserLogged(): boolean {
    return this.authFacade.isUserLogged();
  }

  getToken(): string {
    return this.authFacade.getToken();
  }

  removeToken(): void {
    return this.authFacade.removeToken();
  }
}
