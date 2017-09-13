import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";

import { AppComponent } from './app.component';
import { MemberService } from "app/member.service";
import { MemberListComponent } from "app/memberlist.component";

@NgModule({
    declarations: [
        AppComponent,
        MemberListComponent
    ],
    imports: [
        HttpModule,
        BrowserModule
    ],
    providers: [
        MemberService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
