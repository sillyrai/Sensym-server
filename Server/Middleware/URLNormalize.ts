import { Request,Response } from "express";

export default (req: Request, res: Response, next: Function) => {
    req.url.replace(/\/{2,}/g, '/'); next();
}