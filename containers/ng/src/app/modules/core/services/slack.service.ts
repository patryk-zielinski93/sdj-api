import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SlackService {

    constructor(private httpClient: HttpClient) {
    }

    getSlackAuthorizationUrl(): string {
        return 'https://bulka-group.slack.com/oauth?client_id=331681599316.531334676912&redirect_uri=&state=&scope=channels:read&user_scope=&granular_bot_scope=0&team=&install_redirect=&single_channel=0&tracked=1';
    }

    getAccessToken(code: string) {
        return this.httpClient.get('https://slack.com/api/oauth.access', {
            params: {
                client_id: '331681599316.531334676912',
                client_secret: '8dd45c90e696b6008d851e295091e49d',
                code
            }
        });
    }
}
