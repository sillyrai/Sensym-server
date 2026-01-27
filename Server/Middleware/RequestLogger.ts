import { Request,Response } from "express";
import { requestLog } from "../Modules/Logging";

export default (req: Request, res: Response, next: Function) => {
    res.on('finish', () => {
            requestLog(req, res)
        
    });
    next();
}