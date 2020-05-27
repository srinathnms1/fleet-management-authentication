import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { IUser } from 'models/user';

export const generateJWTToken = (user: IUser) => {
    const SECRET_KEY: jwt.Secret = process.env.PRIVATE_KEY;
    const options: jwt.SignOptions = {
        expiresIn: 1440 // expires in 24 hours
    };

    return jwt.sign({ user: user }, SECRET_KEY, options);
};

export const generateHashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
};

export const validateUser = (user: IUser) => {
    return user.validateSync();
};