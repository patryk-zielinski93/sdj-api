import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SlackApiErrorsHandler {
  handle(error: string): void {
    switch (error) {
      case 'token_revoked':
      case 'missing_scope':
        window.localStorage.removeItem('token');
        location.reload();
    }
  }
}
