import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

interface MyJwtPayload {
    _id: object,
    username: string,
    password: string,
    userType: string,
    createdAt: Date,
    __v: number
}

declare global {
    namespace Express {
        interface Request {
            userData?: MyJwtPayload;
        }
    }
}

export default async (req: Request, res: Response, next: Function) => {
    const auth_token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

    if (!auth_token) { return res.redirect('/login'); }

    if (!process.env.JWT_SECRET) { return res.redirect('/error'); }

    jwt.verify(auth_token, process.env.JWT_SECRET, (error:any, decoded:any) => {
        if (error) {
            console.error("JWT verification failed:", error);
            return res.redirect('/error');
        };
        req.userData = decoded;
        return next();
    });
}
