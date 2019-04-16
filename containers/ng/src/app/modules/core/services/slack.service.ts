import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { appConfig } from '../../../../configs/app.config';

@Injectable({
    providedIn: 'root'
})
export class SlackService {

    constructor(private httpClient: HttpClient) {
    }

    getSlackAuthorizationUrl(): string {
        return `https://slack.com/oauth/authorize?scope=identity.basic&client_id=${appConfig.slack.clientId}&redirect_uri=&state=&scope=channels:read&user_scope=&granular_bot_scope=0&team=&install_redirect=&single_channel=0&tracked=1`;
    }

    getAccessToken(code: string) {
        return this.httpClient.get('https://slack.com/api/oauth.access', {
            params: {
                client_id: appConfig.slack.clientId,
                client_secret: appConfig.slack.clientSecret,
                code
            }
        });
    }
}
