import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import { Routes } from './routes/authRoutes';
import { loggerHandler } from './middleware/loggerMiddleware';

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = 'mongodb://localhost/Authdb';

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }

    private config(): void {
        dotenv.config();
        // application level logger middleware
        this.app.use(loggerHandler);
        // this.app.use(notFoundHandler);
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private mongoSetup(): void {
        (mongoose as any).Promise = global.Promise;
        mongoose.connect(this.mongoUrl);
    }
}

export default new App().app;