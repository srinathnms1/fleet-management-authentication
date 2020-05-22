import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { IUser } from '../models/user';

export const generateJWTToken = (user: IUser, res: Response) => {
    const SECRET_KEY: jwt.Secret = process.env.PRIVATE_KEY;
    const options: jwt.SignOptions = {
        expiresIn: 1440 // expires in 24 hours
    };

    jwt.sign({ user }, SECRET_KEY, options, (err, token) => {
        if (err) {
            res.send(err.message);
        }
        return res.send(token);
    });
}

export const generateHashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
}