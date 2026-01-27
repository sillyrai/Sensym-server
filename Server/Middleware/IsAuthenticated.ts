import { Request,Response } from "express";
import AuthTokenSchema from "../Models/AuthenticationTokenSchema";
import UserSchema from "../Models/UserSchema";

export default async (req: Request, res: Response, next: Function) => {
    let authHeader = req.headers['authorization'] || req.query.authToken;
    if(!authHeader) {
        return res.status(401).send({
            message: 'Authorization header is required'
        });
    }

    let authToken = await AuthTokenSchema.findOne({ token: authHeader });
    if(!authToken) {
        return res.status(401).send({
            message: 'Invalid authentication token'
        });
    }

    let user = await UserSchema.findById(authToken.userId);
    if(!user) {
        return res.status(401).send({
            message: 'User not found'
        });
    }
    res.locals.user = user;
    next();
}