import { Application } from 'express';
import { AuthController } from "../controllers/authController";

export class Routes {
    public authController: AuthController = new AuthController();

    public routes(app: Application): void {
        app.route('/register')
            .post(this.authController.register);

        app.route('/login')
            .post(this.authController.login);
    }
}