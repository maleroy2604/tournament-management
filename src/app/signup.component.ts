import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
    templateUrl: './signup.component.html'
})
export class SignUpComponent {
    public frm: FormGroup;
    public ctlPseudo: FormControl;
    public ctlProfile: FormControl;
    public ctlPassword: FormControl;
    public ctlPasswordConfirm: FormControl;
    public ctlBirthDate: FormControl;

    constructor(
        public authService: AuthService, // pour pouvoir faire le login
        public router: Router,           // pour rediriger vers la page d'accueil en cas de login 
        private fb: FormBuilder          // pour construire le formulaire, du côté TypeScript
    ) {
        this.ctlPseudo = this.fb.control('', [Validators.required, Validators.minLength(3)], [this.pseudoUsed()]);
        this.ctlPassword = this.fb.control('', [Validators.required, Validators.minLength(3)]);
        this.ctlPasswordConfirm = this.fb.control('', [Validators.required, Validators.minLength(3)]);
        this.ctlProfile = this.fb.control('', []);
        this.ctlBirthDate = this.fb.control('', []);
        this.frm = this.fb.group({
            pseudo: this.ctlPseudo,
            password: this.ctlPassword,
            passwordConfirm: this.ctlPasswordConfirm,
            profile: this.ctlProfile,
            birthdate: this.ctlBirthDate
        }, { validator: this.crossValidations });
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
                        this.authService.isPseudoAvailable(pseudo).subscribe(res => {
                            resolve(res ? null : { pseudoUsed: true });
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
        SignUpComponent.assert(
            group,
            ['password', 'passwordConfirm'],
            group.value.password == group.value.passwordConfirm,
            { passwordNotConfirmed: true }
        );
    }

    signup() {
        this.authService.signup(this.frm.value).subscribe(() => {
            if (this.authService.isLoggedIn) {
                // Get the redirect URL from our auth service
                // If no redirect has been set, use the default
                let redirect = this.authService.redirectUrl || '/home';
                this.authService.redirectUrl = null;
                // Redirect the user
                this.router.navigate([redirect]);
            }
        });
    }
}