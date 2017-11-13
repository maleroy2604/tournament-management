import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef, AfterViewInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { SnackBarComponent } from "app/snackbar.component";
import { Observable } from "rxjs/Observable";
import { MyDataSource, SortDirection } from "app/mydatasource";
import { IDialog, DialogResult } from "app/dialog";
import * as _ from 'lodash';
import * as moment from 'moment';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

export interface ColumnDef {
    // nom du champ/attribut associé à la colonne
    name: string,
    // type de donnée pour les valeurs affichées dans cette colonne (ex: String, Date, Bool)
    type: string,
    // en-tête de la colonne
    header: string,
    // largeur de la colonne (les largeurs sont gérées de manière proportionnelles sur l'ensemble des colonnes)
    width?: number,
    // indique si la colonne contient la donnée "clé" (identifiante) d'un record affiché
    key?: boolean,
    // indique si la colonne doit être prise en compte dans le filtrage des données 
    filter?: boolean,
    // indique si la colonne le tri initial de la table doit être fait sur base de cette colonne
    sort?: SortDirection,
    // indique comment le texte doit être aligné horizontalement à l'affichage dans cette colonne
    align?: 'left' | 'right' | 'center' | 'justify' | ''
}

@Component({
    selector: 'mytable',
    templateUrl: 'mytable.component.html',
    styleUrls: ['mytable.component.css']
})
export class MyTableComponent implements OnInit, AfterViewInit {
    dataSource: MyDataSource<object> = new MyDataSource([], '', []);
    filteredColumns: string[] = [];
    key: string;
    sort: string;
    direction: string;
    errors: string[] = [];

    @Input() columnDefs: ColumnDef[] = [];
    @Input() getDataService: () => Observable<any[]>;
    @Input() addService: (any) => Observable<any>;
    @Input() deleteService: (any) => Observable<boolean>;
    @Input() updateService: (any) => Observable<boolean>;
    @Input() filterPlaceHolder: string = 'Filter';
    @Input() editComponent: IDialog;
    @Input() addCaption: string = 'Add New Item';
    @Input() pageSize: number = 0;

    @ViewChild('snackbar') snackbar: SnackBarComponent;
    @ViewChild('filter') filter: ElementRef;

    constructor(private domSanitizer: DomSanitizer) { }

    ngOnInit() {
        this.columnDefs.forEach(c => {
            if (c.key)
                this.key = c.name;
            if (c.filter)
                this.filteredColumns.push(c.name);
            if (c.sort) {
                this.sort = c.name;
                this.direction = c.sort;
            }
        });

        if (!this.key)
            this.errors.push("You must define one column as the key (identifying column)");

        this.getDataService().subscribe(objects => {
            this.dataSource = new MyDataSource(objects, this.key, this.filteredColumns);
            this.dataSource.sort = this.key;
            this.dataSource.pageSize = this.pageSize;
        }, err => {
            this.snackbar.alert('ERROR: ' + err);
        });
    }

    ngAfterViewInit(): void {
        // Permet de ne modifier le filtre de la source de données quand quand l'utilisateur a fini de taper
        if (this.filter)
            Observable.fromEvent(this.filter.nativeElement, 'keyup')
                .debounceTime(150)
                .distinctUntilChanged()
                .subscribe(() => {
                    if (this.dataSource)
                        this.dataSource.filter = this.filter.nativeElement.value;
                });
    }

    headerClicked(c: ColumnDef) {
        this.dataSource.sort = c.name;
    }

    getHeaderStyle(c: ColumnDef) {
        let s = 'text-align:' + c.align + ';cursor:pointer' + ";width:" + c.width + "%";
        return this.domSanitizer.bypassSecurityTrustStyle(s);
    }

    getCellStyle(c: ColumnDef) {
        let s = 'text-align:' + c.align;
        return this.domSanitizer.bypassSecurityTrustStyle(s);
    }

    getSortClass(c: ColumnDef) {
        if (c.name === this.dataSource.sort)
            if (this.dataSource.direction === 'asc')
                return 'fa fa-fw fa-sort-asc';
            else if (this.dataSource.direction === 'desc')
                return 'fa fa-fw fa-sort-desc';
            else
                return 'fa fa-fw fa-sort';
        else
            return '';
    }

    getPages() {
        return _.range(this.dataSource.numPages);
    }

    pageClicked(i: number) {
        this.dataSource.pageIndex = i;
    }

    getValue(row, col: ColumnDef) {
        let val = row[col.name];
        if (val && col.type === 'Date' && moment(val).isValid())
            return moment(val).format('DD/MM/YYYY');
        return val;
    }

    public add(obj: object, cancellable = true) {
        this.dataSource.add(obj);
        this.addService(obj).subscribe(member => {
            this.dataSource.update(member);
            if (cancellable) {
                this.snackbar.show(`Member '${obj[this.key]}' successfully added`, 10000, () => {
                    this.delete(obj, false);
                });
            }
        }, err => {
            this.snackbar.alert('ERROR: ' + err);
        });
    }

    public delete(obj: object, cancellable = true) {
        this.dataSource.delete(obj);
        this.deleteService(obj).subscribe(result => {
            if (cancellable) {
                this.snackbar.show(`Member '${obj[this.key]}' successfully deleted`, 10000, () => {
                    this.add(obj, false);
                });
            }
        }, err => {
            this.snackbar.alert('ERROR: ' + err);
        });
    }

    public update(updated: object, old: object, cancellable = true) {
        this.dataSource.update(updated);
        this.updateService(updated).subscribe(result => {
            if (cancellable) {
                this.snackbar.show(`Member '${updated[this.key]}' successfully updated`, 10000, () => {
                    this.update(old, null, false);
                });
            }
        }, err => {
            this.snackbar.alert('ERROR: ' + err);
        });
    }

    public edit(obj: object = {}, cancellable = true) {
        this.editComponent.show(obj).subscribe(res => {
            if (res.action === 'cancel') return;
            let updated = res.data as any;
            if (updated._id)
                this.update(updated, obj);
            else
                this.add(updated);
        });
    }
}
