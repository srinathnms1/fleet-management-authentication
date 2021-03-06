import * as mongoose from 'mongoose';
import { Request } from 'express';

import Roles from '../enums/role';

export interface IUserAuthInfoRequest extends Request {
    user: { user: IUser };
}

export interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    password: string;
    phone: string;
    role: Roles;
}

const UserSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: 'Enter a first name'
    },
    lastName: {
        type: String,
        required: 'Enter a last name'
    },
    email: {
        type: String,
        required: 'Enter an email',
    },
    company: {
        type: String
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    phone: {
        type: Number
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: Roles,
        required: true,
    }
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;