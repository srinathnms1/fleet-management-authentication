import { Request, Response, NextFunction, response } from 'express';
import * as bcrypt from 'bcrypt';
import User from '../models/user';
import { generateJWTToken, generateHashPassword } from '../common/authUtils';
import HttpException from '../exceptions/HttpException';

export class AuthController {
    public register = async (req: Request, res: Response, next: NextFunction) => {
        const newUser = new User(req.body);
        await newUser.validate((err) => {
            if (err) {
                next(new HttpException(400, err));
            }
        });

        const isUserExists = await this.getUser({ email: newUser.email }, next);
        if (isUserExists) {
            next(new HttpException(400, 'User already exists!'));
        }

        newUser.password = await generateHashPassword(newUser.password);

        await newUser.save((err, user) => {
            if (err) {
                res.send(err);
            }
            res.json('User has been registered successfully');
        });
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const user = await this.getUser({ email: email }, next);

        if (!user) {
            return next(new HttpException(400, 'Incorrect email or password.'));
        }
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return next(new HttpException(400, 'Incorrect email or password.'));
        }

        generateJWTToken(user, res);
    }

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        return await User.find({}, (err, users) => {
            if (err) {
                next(new HttpException(500, err.message));
            }
            return res.send(users);
        });
    }

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;

        const user = await this.getUser({ _id: userId }, next);

        if (!user) {
            next(new HttpException(404, 'User not found!'));
        }

        return res.send(user);
    }

    private getUser = async (data: any, next: NextFunction) => {
        return await User.findOne({ ...data }, (err, reponse) => {
            if (err) {
                next(new HttpException(500, err.message));
            }

            return response;
        });
    }
}