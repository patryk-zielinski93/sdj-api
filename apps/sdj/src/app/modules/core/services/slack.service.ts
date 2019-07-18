import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';

@Injectable({
    providedIn: 'root'
})
export class SlackService {

    constructor(private httpClient: HttpClient) {
    }

    getSlackAuthorizationUrl(): string {
        return `https://slack.com/oauth/authorize?scope=identity.basic&scope=channels:read,mpim:read,im:read&client_id=${environment.slack.clientId}&redirect_uri=&state=&user_scope=&granular_bot_scope=0&team=&install_redirect=&single_channel=0&tracked=1&redirect_uri=${window.location.origin}`;
    }

    getAccessToken(code: string) {
        return this.httpClient.get('https://slack.com/api/oauth.access', {
            params: {
                client_id: environment.slack.clientId,
                client_secret: environment.slack.clientSecret,
                code,
                redirect_uri: window.location.origin
            }
        });
    }
}
