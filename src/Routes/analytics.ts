import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    try {
        res.render('analytics', {
            styles: ["analytics_page.css"],
            title: "Sensym | Analytics",
        });
    } catch (err) {
        console.error('Analytics render failed:', err);
        return res.status(500).render('error', {
            styles: ["error.css"],
            message: 'Failed to load analytics page'
        });
    }
})

export default router;
