import { Component } from '@angular/core';
import { MemberService, Member } from "app/member.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public members: Member[];
    constructor(private memberService: MemberService) { }

    ngOnInit() {
        this.memberService.getAll().subscribe(res => {
            this.members = res;
        })
    }
}
