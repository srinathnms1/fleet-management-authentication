import { Application } from 'express';
import { AuthController } from '../controllers/authController';
import authorize from '../middleware/authorize';
import Roles from '../enums/role';

export class Routes {
    public authController: AuthController = new AuthController();

    public routes(app: Application): void {
        app.route('/register')
            .post(this.authController.register);

        app.route('/login')
            .post(this.authController.login);

        app.route('/getAll')
            .get(authorize([Roles.Admin]), this.authController.getAllUsers);

        app.route('/getById/:userId')
            .get(authorize(), this.authController.getUserById);
    }
}