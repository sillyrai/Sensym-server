import { Router } from "express";

import SensorSchema from "../lib/mongoDB_models/Sensor_Schema";

const router = Router();

router.get("/", async (req, res) => {
    try {

        const data = await SensorSchema.find({}).limit(24);
        
        res.render('_analytics/page_analytics', {
            styles: ["analytics_page.css"],
            title: "Sensym | Analytics",

            sensors: data,

            role: res.locals.userData.role,
            auth_token: req.cookies.auth_token || "",
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
