import { Request, Response, NextFunction } from 'express';

// custom middleware create
export const loggerHandler = (req: Request, res: Response, next: NextFunction) => {
    console.log(`Logged  ${req.url}  ${req.method} -- ${new Date()}`);
    return next();
};