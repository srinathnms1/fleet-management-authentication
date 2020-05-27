import * as bcrypt from 'bcrypt';

import * as AuthUtlis from '../common/authUtils';
import User, { IUser } from '../models/user';
import HttpException from '../exceptions/httpException';

export const getAll = async () => {
    return await User.find({});
};

export const get = async (user: any) => {
    return await User.findOne({ ...user });
};

export const create = async (user: IUser) => {
    const isUserValid = AuthUtlis.validateUser(user);
    if (isUserValid) {
        throw new HttpException(400, isUserValid.message);
    }

    const isExists = await get({ email: user.email });
    if (isExists) {
        throw new HttpException(400, 'User already exists!');
    }

    user.password = await AuthUtlis.generateHashPassword(user.password);

    return await user.save();
};

export const authenticate = async (user: IUser) => {
    const existingUser = await get({ email: user.email });
    if (!existingUser) {
        throw new HttpException(400, 'Incorrect email or password.');
    }

    const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
    if (!isPasswordValid) {
        throw new HttpException(400, 'Incorrect email or password.');
    }

    return AuthUtlis.generateJWTToken(existingUser);
};

export const put = async (userId: string, user: IUser) => {
    const isUserExists = await get({ _id: userId });
    if (!isUserExists) {
        throw new HttpException(404, 'User not found.');
    }

    return await User.findOneAndUpdate({ _id: userId }, user, { new: true });
};

export const _delete = async (userId: string) => {
    return await User.findByIdAndRemove({ _id: userId });
};