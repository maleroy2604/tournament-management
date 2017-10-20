import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions } from "@angular/http";
import { RouterModule } from '@angular/router';
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { MemberService } from "app/member.service";
import { MemberListComponent } from "app/memberlist.component";
import { LoginComponent } from "app/login.component";
import { HomeComponent } from "app/home.component";
import { UnknownComponent } from "app/unknown.component";
import { SecuredHttp } from "app/securedhttp.service";
import { AuthGuard } from "app/auth-guard.service";
import { AuthService } from "app/auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RestrictedComponent } from "app/restricted.component";
import { LogoutComponent } from "app/logout.component";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(
        new AuthConfig({
            tokenGetter: (() => sessionStorage.getItem('id_token'))
        }),
        http,
        options
    );
}

@NgModule({
    declarations: [
        AppComponent,
        MemberListComponent,
        LoginComponent,
        LogoutComponent,
        HomeComponent,
        UnknownComponent,
        RestrictedComponent
    ],
    imports: [
        HttpModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            {
                path: '',
                canActivate: [AuthGuard],
                children: [
                    { path: 'logout', component: LogoutComponent },
                    { path: 'home', component: HomeComponent },
                    { path: 'members', component: MemberListComponent },
                ]
            },
            { path: 'restricted', component: RestrictedComponent },
            { path: '**', component: UnknownComponent }
        ])
    ],
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        SecuredHttp,
        AuthGuard,
        AuthService,
        MemberService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
