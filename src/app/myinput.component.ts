import { Component, forwardRef, ElementRef, ViewChild, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from "@angular/forms";
import { MyControlComponent } from "app/mycontrol.component";
import { ValidationService } from "app/validation.service";

@Component({
    selector: 'my-input',
    template: `
        <div class="form-group" [ngClass]="outerControl.pristine ? null : (outerControl.dirty && outerControl.invalid ? 'has-error' : 'has-success')">
            <ng-container *ngIf="type=='checkbox'; else not_checkbox">
                <div class="col-sm-offset-2 col-sm-10">
                    <div class="checkbox">
                        <label class="control-label">
                            <input #ref [type]="type" [checked]="value" (change)="value=!value" id="{{id}}" class="checkbox" [readonly]="readonly">
                            {{label}}
                        </label>
                    </div>
                </div>
            </ng-container>
            <ng-template #not_checkbox>
                <div class="col-sm-2">
                    <label class="control-label" for="{{id}}">{{label}}</label>
                </div>
                <div class="col-sm-10">
                    <input #ref [type]="type" [(ngModel)]="value" id="{{id}}" class="form-control" [readonly]="readonly">
                </div>
                <div class="col-sm-offset-2 col-sm-10 help-block" *ngIf="outerControl.dirty && outerControl.invalid">
                    <div *ngFor="let err of errorMessages">
                        <small>{{err}}</small>
                    </div>
                </div>
            </ng-template>
        </div>
    `,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MyInputComponent), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MyInputComponent), multi: true }
    ],
})
export class MyInputComponent extends MyControlComponent {
    @ViewChild('ref') ref: ElementRef;
    @Input() type: 'text' | 'password' | 'date' = 'text';

    constructor(messageSvc: ValidationService, elem: ElementRef) {
        super(messageSvc, elem);
    }

    public setFocus(select?: boolean) {
        var e = this.ref.nativeElement;
        if (e && select) {
            e.focus();
            e.select();
        }
    }

    public ngAfterViewInit() {
        setTimeout(_ => this.setFocus(this.focus));
    }
}
