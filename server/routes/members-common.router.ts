import { Router, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import Member from '../models/member';
import { AuthentificationRouter } from "./authentication.router";

export class MembersCommonRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/available/:id', this.isAvailable);
        this.router.post('/', this.create);
    }

    public isAvailable(req: Request, res: Response, next: NextFunction) {
        Member.count({ pseudo: req.params.id })
        .then(count => res.json(count == 0))
        .catch(err => res.send(err));
    }

    public create(req: Request, res: Response, next: NextFunction) {
        //TODO: check available
        delete req.body._id;   
        let member = new Member(req.body);
        member.save()
        .then(m => res.json(m))
        .catch(err => res.send(err));
    }
}
