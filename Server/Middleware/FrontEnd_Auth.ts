import { Request,Response } from "express";

export default async (req: Request, res: Response, next: Function) => {
    const auth_cookie = req.cookies.sensym_auth;

    if (!auth_cookie) { // remove '!' to enable AUTH
        return next();
    }

    
    
    return res.redirect("/login");
}
