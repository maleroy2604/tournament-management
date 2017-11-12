import { Component, ViewChild } from "@angular/core";
import { MemberService, Member } from "app/member.service";
import { EditMemberComponent } from "app/edit-member.component";
import { ColumnDef } from "app/mytable.component";
import { SnackBarComponent } from "app/snackbar.component";

@Component({
    selector: 'memberlist',
    templateUrl: './memberlist.component.html',
})
export class MemberListComponent {
    columnDefs: ColumnDef[] = [
        { name: 'pseudo', type: 'String', header: 'Pseudo', width: 1, key: true, filter: true, sort: 'asc' },
        { name: 'profile', type: 'String', header: 'Profile', width: 2, filter: true },
        { name: 'birthdate', type: 'Date', header: 'Birth Date', width: 1, filter: true, align: 'center' },
        { name: 'admin', type: 'Boolean', header: 'Is Admin', width: 1, filter: false, align: 'center' }
    ];

    constructor(private memberService: MemberService) {
    }

    get getDataService() {
        return m => this.memberService.getAll();
    }

    get addService() {
        return m => this.memberService.add(m);
    }

    get deleteService() {
        return m => this.memberService.delete(m);
    }

    get updateService() {
        return m => this.memberService.update(m);
    }
}