import { Application } from 'express';

import authorize from '../middleware/authorize';
import Roles from '../enums/role';
import { UserController } from '../controllers/userController';

export class UserRoutes {
    public userController: UserController = new UserController();

    public routes(app: Application): void {
        app.route('/register')
            .post(this.userController.register);

        app.route('/login')
            .post(this.userController.login);

        app.route('/getAll')
            .get(authorize([Roles.Admin]), this.userController.getAllUsers);

        app.route('/get/:userId')
            .get(authorize(), this.userController.getUserById);

        app.route('/put/:userId')
            .put(authorize(), this.userController.putUser);

        app.route('/delete/:userId')
            .delete(authorize(), this.userController.deleteUser);
    }
}