import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

import { Routes } from './routes/authRoutes';
import { loggerHandler } from './middleware/loggerMiddleware';
import errorMiddleware from './middleware/errorMiddleware';
import HttpException from './exceptions/HttpException';

class App {
    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = 'mongodb://localhost/Authdb';
    // public mongoUrl: string = 'mongodb+srv://srinathnms:<password>@cluster0-goawe.mongodb.net/test?retryWrites=true&w=majority';

    public constructor() {
        this.app = express();
        this.config();
        this.configCors();
        this.routePrv.routes(this.app);
        this.mongoSetup();
        this.initializeLoggerHandling();
        this.initializeErrorHandling();
    }

    private config(): void {
        dotenv.config();
        // this.app.use(notFoundHandler);
        // support application/json type post data
        this.app.use(bodyParser.json());
        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private configCors(): void {
        this.app.use(cors({
            origin: 'http://yourapp.com'
        }));
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeLoggerHandling() {
        // application level logger middleware
        this.app.use(loggerHandler);
    }

    private mongoSetup(): void {
        (mongoose as any).Promise = global.Promise;
        mongoose.connect(this.mongoUrl)
            .catch((err) => {
                return new HttpException(500, err);
            });
    }
}

export default new App().app;