import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import User, { IUser } from '../models/user';
import { generateJWTToken, generateHashPassword } from '../common/authUtils';

export class AuthController {
    register = async (req: Request, res: Response) => {
        let newUser = new User(req.body);
        const { message } = newUser.validateSync();
        if (message) {
            return res.status(400).send(message);
        }

        const isUserExists = await this.getUser(newUser, res);
        if (isUserExists) {
            return res.status(400).send('User already exists!');
        }
        
        newUser.password = await generateHashPassword(newUser.password);

        await newUser.save((err, user) => {
            if (err) {
                res.send(err);
            }
            res.json("User has been registered successfully");
        });
    }

    login = async (req: Request, res: Response) => {
        let user = new User(req.body);
        await user.validate((error) => {
            if (error) {
                return res.status(400).send(error.message);
            }
        });

        const existingUser = await this.getUser(user, res);
        const validPassword = await bcrypt.compare(req.body.password, existingUser.password);

        if (!validPassword || !existingUser) {
            return res.status(400).send('Incorrect email or password.');
        }

        generateJWTToken(user, res);
    }

    private getUser = async (user: IUser, res: Response) => {
        return await User.findOne({ email: user.email }, (err, user) => {
            if (err) {
                return res.status(500).send('Internal Server Error!');
            }
            return user;
        });
    }
}