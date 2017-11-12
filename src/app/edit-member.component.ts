import { Component, OnInit, Inject, ElementRef, ViewChild, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { MemberService, Member } from "app/member.service";
import { IDialog, DialogResult } from "app/dialog";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { MyInputComponent } from "app/myinput.component";
import { MyModalComponent } from "app/mymodal.component";
import { validateConfig } from '@angular/router/src/config';

declare var $: any;

@Component({
    selector: 'edit-member',
    templateUrl: 'edit-member.component.html'
})
export class EditMemberComponent implements OnInit, IDialog {
    public frm: FormGroup;
    public ctlPseudo: FormControl;
    public ctlProfile: FormControl;
    public ctlPassword: FormControl;
    public ctlBirthDate: FormControl;
    public ctlAdmin: FormControl;
    public closed: Subject<DialogResult>;

    @ViewChild(MyModalComponent) modal: MyModalComponent;
    @ViewChild('pseudo') pseudo: MyInputComponent;

    constructor(private memberService: MemberService, private fb: FormBuilder) {
        this.ctlPseudo = this.fb.control('', [Validators.required, Validators.minLength(3), this.forbiddenValue('abc')], [this.pseudoUsed()]);
        this.ctlPassword = this.fb.control('', [Validators.required, Validators.minLength(3)]);
        this.ctlProfile = this.fb.control('', []);
        this.ctlBirthDate = this.fb.control('', []);
        this.ctlAdmin = this.fb.control(false, []);
        this.frm = this.fb.group({
            _id: null,
            pseudo: this.ctlPseudo,
            password: this.ctlPassword,
            profile: this.ctlProfile,
            birthdate: this.ctlBirthDate,
            admin: this.ctlAdmin
        }, { validator: this.crossValidations });
    }

    // Validateur bidon qui vérifie que la valeur est différente
    forbiddenValue(val: string): any {
        return (ctl: FormControl) => {
            if (ctl.value === val)
                return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } }
            return null;
        };
    }

    // Validateur asynchrone qui vérifie si le pseudo n'est pas déjà utilisé par un autre membre
    pseudoUsed(): any {
        let timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            let pseudo = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine)
                        resolve(null);
                    else
                        this.memberService.getOne(pseudo).subscribe(member => {
                            resolve(member ? { pseudoUsed: true } : null);
                        });
                }, 300);
            });
        };
    }

    static assert(group: FormGroup, ctlName: string[], value: boolean, error: object) {
        ctlName.forEach(n => {
            if (group.contains(n)) {
                if (!value) {
                    group.get(n).setErrors(error);
                    group.get(n).markAsDirty();
                }
                else {
                    group.get(n).setErrors(null);
                }
            }
        });
    }

    crossValidations(group: FormGroup) {
        if (group.pristine || !group.value) return;
        EditMemberComponent.assert(
            group,
            ['password', 'profile'],
            group.value.password != group.value.profile,
            { passwordEqualProfile: true }
        );
    }

    ngOnInit() {
        this.modal.shown.subscribe(_ => this.pseudo.setFocus(true));
    }

    show(m: Member): Subject<DialogResult> {
        this.closed = new Subject<DialogResult>();
        this.frm.reset();
        this.frm.markAsPristine();
        this.frm.patchValue(m);
        this.modal.show();
        return this.closed;
    }

    update() {
        this.modal.close();
        this.closed.next({ action: 'update', data: this.frm.value });
    }

    cancel() {
        this.modal.close();
        this.closed.next({ action: 'cancel', data: this.frm.value });
    }

    ouvrir() {
        console.log("ouvert");
    }

    fermer() {
        console.log("fermé");
    }
}
