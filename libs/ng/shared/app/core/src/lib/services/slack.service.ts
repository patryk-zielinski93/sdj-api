import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@ng-environment/environment";
import { Channel } from "@sdj/shared/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SlackService {
  readonly baseSlackUrl: string = 'https://slack.com/api/';
  readonly channelList: string =
    this.baseSlackUrl +
    'conversations.list?types=public_channel%2C%20private_channel&pretty=1';

  constructor(private http: HttpClient) {}

  getChannelList(): Observable<Channel[]> {
    return this.http
      .get<any>(this.channelList)
      .pipe(map(response => response.channels));
  }

  getSlackAuthorizationUrl(): string {
    return `https://slack.com/oauth/authorize?scope=identity.basic&scope=groups:read,channels:read,mpim:read,im:read&client_id=${
      environment.slack.clientId
    }&redirect_uri=&state=&user_scope=&granular_bot_scope=0&team=&install_redirect=&single_channel=0&tracked=1&redirect_uri=${
      window.location.origin
    }`;
  }

  getAccessToken(code: string): Observable<any> {
    return this.http.get('https://slack.com/api/oauth.access', {
      params: {
        client_id: environment.slack.clientId,
        client_secret: environment.slack.clientSecret,
        code,
        redirect_uri: window.location.origin
      }
    });
  }
}
