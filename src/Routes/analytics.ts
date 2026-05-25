import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {

    res.render('analytics', {
        styles: ["analytics_page.css"],
        title: "Sensym | Analytics",
    });
})

export default router;
