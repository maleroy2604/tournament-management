import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MemberService } from "app/member.service";
import { MemberListComponent } from "app/memberlist.component";
import { LoginComponent } from "app/login.component";
import { HomeComponent } from "app/home.component";
import { UnknownComponent } from "app/unknown.component";

@NgModule({
    declarations: [
        AppComponent,
        MemberListComponent,
        LoginComponent,
        HomeComponent,
        UnknownComponent
    ],
    imports: [
        HttpModule,
        BrowserModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'home', component: HomeComponent },
            { path: 'members', component: MemberListComponent },
            { path: '**', component: UnknownComponent }
        ])
    ],
    providers: [
        MemberService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
