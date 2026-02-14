import { Router } from "express";

import SensorSchema from "../Models/SensorSchema";

const router = Router();

router.get("/", async (req, res) => {
    const data = await SensorSchema.find({}).limit(25);

    res.render('sensors', {
        styles: ["sensors.css"],
        sensors: data,
        timeFormat: { hour: "numeric", minute: "numeric" },
        dateFormat: { year: "numeric", month: "numeric", day: "numeric" }
    });
})

export default router;
