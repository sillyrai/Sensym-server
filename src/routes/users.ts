import { Router } from "express";

import UserSchema from '../lib/mongoDB_models/User_Schema';

const router = Router();

router.get("/", async (req, res) => {
    try {
        const user_role = req.cookies.auth.token.role;

        const users = await UserSchema
            .find({})
            .limit(24);

        res.render("page_users", {
            styles: ["page_users.css"],

            users,
            user_role
        });
    } catch (err) {
        console.error('Users page render failed:', err);
        return res.status(500).render('error', {
            styles: ["error.css"],
            message: 'Failed to load users page'
        });
    }
})

export default router;
