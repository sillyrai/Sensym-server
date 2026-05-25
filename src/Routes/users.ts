import { Router } from "express";

import UserSchema from '../Lib/mongoDB_models/User_Schema';

const router = Router();

router.get("/", async (req, res) => {
    const user_role = req.cookies.auth.token.role;

    const users = await UserSchema
        .find({})
        .limit(24);

    res.render("page_users", {
        styles: ["page_users.css"],

        users,
        user_role
    });
})

export default router;
