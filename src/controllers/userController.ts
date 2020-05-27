import { Request, Response, NextFunction } from 'express';

import User, { IUser } from '../models/user';
import HttpException from '../exceptions/httpException';
import * as UserService from '../services/userService';

export class UserController {
    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        UserService.getAll()
            .then(users => res.send(users))
            .catch(err => next(err));
    }

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        UserService.get({ _id: userId })
            .then(user => {
                if (!user) {
                    next(new HttpException(404, 'User not found.'));
                }
                return res.send(user);
            })
            .catch(err => next(err));
    }

    public register = async (req: Request, res: Response, next: NextFunction) => {
        const newUser = new User(req.body);
        UserService.create(newUser)
            .then((user: IUser) => {
                res.json('User has been registered successfully');
            })
            .catch((err) => next(err));
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        const user = new User(req.body);

        UserService.authenticate(user)
            .then((token: string) => res.send(token))
            .catch((err) => next(err));
    }

    public putUser = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const userToUpdate = req.body;
        UserService.put(userId, userToUpdate)
            .then((user: IUser) => res.send(user))
            .catch((err) => next(err));
    }

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        UserService._delete(userId)
            .then(() => res.json('User has been removed successfully'))
            .catch((err) => next(err));
    }
}