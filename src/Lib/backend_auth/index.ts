import { Request,Response } from "express";
import jwt from "jsonwebtoken";
import AuthTokenSchema from "../mongoDB_models/AuthenticationTokenSchema_Schema";
import UserSchema from "../mongoDB_models/User_Schema";

export default async (req: Request, res: Response, next: Function) => {
    let authHeader = req.headers['authorization'] || req.query.auth_token;
    if(!authHeader) {
        return res.status(401).send({
            message: 'Authorization header is required'
        });
    }

    let token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    if(typeof token !== 'string') {
        return res.status(401).send({
            message: 'Invalid authentication token'
        });
    }

    if(token.toLowerCase().startsWith('bearer ')) {
        token = token.slice(7).trim();
    }

    // Legacy token flow: check persistent auth token collection first.
    let authToken = await AuthTokenSchema.findOne({ token });
    if(authToken) {
        let user = await UserSchema.findById(authToken.userId);
        if(!user) {
            return res.status(401).send({
                message: 'User not found'
            });
        }
        res.locals.user = user;
        return next();
    }

    // JWT flow: allow stateless tokens (same style used by frontend auth).
    if(!process.env.JWT_SECRET) {
        return res.status(401).send({
            message: 'Server auth configuration missing'
        });
    }

    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return res.status(401).send({
            message: 'Invalid authentication token'
        });
    }

    let userId = typeof decoded === 'object' ? decoded.id : undefined;
    let user = await UserSchema.findById(userId);
    if(!user) {
        return res.status(401).send({
            message: 'User not found'
        });
    }
    res.locals.user = user;
    return next();
}
