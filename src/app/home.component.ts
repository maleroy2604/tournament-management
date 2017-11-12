import { Component } from '@angular/core';
import { AuthService } from "app/auth.service";
import { MemberService } from "app/member.service";

@Component({
    selector: 'app-root',
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    public memberCount: number | '?' = '?';

    constructor(public authService: AuthService, public memberService: MemberService) {
        this.memberService.getCount().subscribe(c => this.memberCount = c);
    }
}
