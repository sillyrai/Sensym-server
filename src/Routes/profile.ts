import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("profile", {
        styles: ["page_profile.css"],
        title: "Profile",

        user: res.locals.userData.user,
        role: res.locals.userData.role,

        auth_token: req.cookies.auth_token
    });
})

export default router;
