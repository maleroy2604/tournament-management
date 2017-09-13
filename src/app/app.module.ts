import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";

import { AppComponent } from './app.component';
import { MemberService } from "app/member.service";

@NgModule({
    declarations: [
        AppComponent
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
