import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
    selector: 'restricted',
    template: `
    <h1>Restricted Access</h1>
    <p>You will be redirected automatically to the login page...</p>
    `
})

export class RestrictedComponent implements OnInit {
    constructor(private router: Router) { }

    ngOnInit() {
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 2000);
    }
}