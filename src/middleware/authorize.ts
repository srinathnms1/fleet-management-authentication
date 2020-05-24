import * as expressJwt from 'express-jwt';
import { Response, NextFunction } from 'express';
import { IUserAuthInfoRequest } from 'models/user';

const authorize = (roles = []) => {
    const SECRET_KEY = {
        secret: process.env.PRIVATE_KEY
    } as expressJwt.Options;
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        expressJwt(SECRET_KEY),

        // authorize based on user role
        (req: IUserAuthInfoRequest, res: Response, next: NextFunction) => {
            if (roles.length && !roles.includes(req.user.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
};

export default authorize;