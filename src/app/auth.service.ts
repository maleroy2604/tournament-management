import { Injectable } from '@angular/core';
import { SecuredHttp } from 'app/securedhttp.service';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthService {
    isLoggedIn: boolean;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(private secHttp: SecuredHttp) {
        this.isLoggedIn = sessionStorage.getItem('id_token') != null;
    }

    login(username, password): Observable<boolean> {
        return this.secHttp.login(username, password).map(res => {
            this.isLoggedIn = res;
            return res;
        });
    }

    logout(): void {
        this.isLoggedIn = false;
        this.secHttp.logout();
    }

    public get currentUser(): string {
        return sessionStorage.getItem('pseudo');
    } 
}