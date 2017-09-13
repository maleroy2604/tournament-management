import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, RequestOptions } from "@angular/http";

import 'rxjs/add/operator/map';

export class Member {
    _id: string;
    pseudo: string;
    password: string;
    profile: string;

    constructor(data) {
        this._id = data._id;
        this.pseudo = data.pseudo;
        this.password = data.password;
        this.profile = data.profile;
    }
}

const URL = '/api/members';

@Injectable()
export class MemberService {
    constructor(private http: Http) {
    }

    public getAll(): Observable<Member[]> {
        return this.http.get(URL)
            .map(result => {
                let tmp: Member[] = [];
                for (let o of result.json())
                    tmp.push(new Member(o));
                return tmp;
            })
    }

    public getOne(pseudo: string): Observable<Member> {
        return this.http.get(URL + pseudo)
            .map(result => {
                let data = result.json();
                return data.length > 0 ? new Member(data[0]) : null;
            });
    }

    public update(m: Member): Observable<boolean> {
        console.log(m);
        return this.http.put(URL + m.pseudo, m).map(res => true);
    }

    public delete(m: Member): Observable<boolean> {
        return this.http.delete(URL + m.pseudo).map(res => true);
    }

    public add(m: Member): Observable<Member> {
        return this.http.post(URL, m).map(res => new Member(res.json()));
    }
}
