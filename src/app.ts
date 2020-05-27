import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';

import { loggerHandler } from './middleware/loggerMiddleware';
import errorMiddleware from './middleware/errorMiddleware';
import HttpException from './exceptions/httpException';
import { swaggerDocument } from './swagger/swagger';
import { UserRoutes } from './routes/userRoutes';

class App {
    public app: express.Application;
    public router = express.Router();
    public routePrv: UserRoutes = new UserRoutes();
    public mongoUrl: string = 'mongodb://localhost/Authdb';

    public constructor() {
        this.app = express();
        this.config();
        this.configCors();
        this.routePrv.routes(this.app);
        this.mongoSetup();
        this.initializeSwagger();
        this.initializeLoggerHandling();
        this.initializeErrorHandling();
    }

    private config(): void {
        dotenv.config();
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

    private initializeSwagger() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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