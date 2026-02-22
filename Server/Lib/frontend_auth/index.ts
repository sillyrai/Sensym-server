import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserSchema from '../mongoDB_models/User_Schema';

export default async (req: Request, res: Response, next: Function) => {
    const auth_token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

    if (!auth_token) { return res.redirect('/login'); }

    if (!process.env.JWT_SECRET) { return res.redirect('/error'); }

    jwt.verify(auth_token, process.env.JWT_SECRET, async (error:any, decoded:any) => {
        if (error) {
            console.error("JWT verification failed:", error);
            return res.redirect('/error');
        };

        let user = await UserSchema.findOne({ _id: decoded.id });

        if(!user) {
            return res.status(401).render("login", {
                styles: ["auth_pages.css"],
                message: { 
                    text: "Invalid username and/or password",
                    type: "info" 
                }
            });
        }

        res.locals.userData = {
            user: user.username,
            role: user.role
        };
        return next();
    });
}
