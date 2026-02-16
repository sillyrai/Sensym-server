import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {

    res.render('analytics', {
        styles: ["analytics_page.css"],
        // stats: formatted
    });
})

export default router;
