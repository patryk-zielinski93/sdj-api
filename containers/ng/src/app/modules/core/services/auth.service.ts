import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;

    constructor() {
    }

    isUserLogged(): boolean {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }

    setToken(token: string) {
        this.token = token;
    }
}
