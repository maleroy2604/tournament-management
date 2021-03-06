import * as http from 'http';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { Member, Address } from './models/member';
import { MembersRouter } from './routes/members.router';
import { AuthentificationRouter } from "./routes/authentication.router";
import { MembersCommonRouter } from './routes/members-common.router';

const MONGO_URL = 'mongodb://127.0.0.1/msn';

export class Server {
    private express: express.Application;
    private server: http.Server;
    private port: any;

    constructor() {
        this.express = express();
        this.middleware();
        this.mongoose();
        this.routes();
    }

    private middleware(): void {
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
    }

    // initialise les routes
    private routes() {
        this.express.use('/api/token', new AuthentificationRouter().router);
        this.express.use('/api/members-common', new MembersCommonRouter().router);
        this.express.use(AuthentificationRouter.checkAuthorization);    // à partir d'ici il faut être authentifié
        this.express.use('/api/members', new MembersRouter().router);
    }

    // initialise mongoose
    private mongoose() {
        (mongoose as any).Promise = global.Promise;     // see: https://stackoverflow.com/a/38833920
        let trials = 0;
        let connectWithRetry = () => {
            trials++;
            return mongoose.connect(MONGO_URL, err => {
                if (err) {
                    if (trials < 3) {
                        console.error('Failed to connect to mongo on startup - retrying in 2 sec');
                        setTimeout(connectWithRetry, 2000);
                    }
                    else {
                        console.error('Failed to connect to mongo after 3 trials ... abort!');
                        process.exit(-1);
                    }
                }
                else {
                    console.log('Connected to MONGODB');
                    this.initData();
                }
            });
        };
        connectWithRetry();
    }

    private initData() {
        Member.count({}).then(count => {
            if (count === 0) {
                console.log("Initializing data...");
                let addr1 = new Address({ "street_addr": "rue bazar 12", "postal_code": "1000", "localization": "Bxl" });
                let addr2 = new Address({ "street_addr": "rue machin 5", "postal_code": "1200", "localization": "Bxl" });
                let bruno = new Member({ pseudo: "bruno", password: "bruno", profile: "Hi, I'm bruno!", addresses: [addr1, addr2] });
                addr1.member = bruno;
                addr2.member = bruno;
                Address.insertMany([addr1, addr2]).then(_ => {
                    Member.insertMany([
                        { pseudo: "test", password: "test", profile: "Hi, I'm test!" },
                        { pseudo: "ben", password: "ben", profile: "Hi, I'm ben!" },
                        bruno,
                        { pseudo: "boris", password: "boris", profile: "Hi, I'm boris!" },
                        { pseudo: "alain", password: "alain", profile: "Hi, I'm alain!" }
                    ]);
                })
            }
        });
        Member.count({ pseudo: 'admin' }).then(count => {
            if (count === 0) {
                console.log("Creating admin account...");
                let m = new Member({
                    pseudo: "admin", password: "admin",
                    profile: "I'm the administrator of the site!", admin: true
                });
                m.save();
            }
        });
    }

    // démarrage du serveur express
    public start(): void {
        this.port = process.env.PORT || 3000;
        this.express.set('port', this.port);
        this.server = http.createServer(this.express);
        this.server.listen(this.port, () => console.log(`Node/Express server running on localhost:${this.port}`));
    }
}
