import { Router } from "express";

import SensorSchema from "../Lib/mongoDB_models/Sensor_Schema";
import SensorDataSchema from "../Lib/mongoDB_models/SensorData_Schema";

const router = Router();

router.get("/", async (req, res) => {
    const data = await SensorSchema.find({}).limit(24);

    res.render('_sensors/sensors', {
        styles: ["sensors_page.css"],
        sensors: data
    });
})

//-// This '/add' route MUST BE before '/:sensor_id' <-- IMPORTANT IMPORTANT //-//
router.get("/add", async (req, res) => {    

    res.render('_sensors/page_add_sensor', {
        styles: ["page_add_sensor.css"],
        authToken: req.cookies.auth_token || "",
    });
})

router.get("/:sensor_id", async (req, res) => {
    const sensor_id = req.params.sensor_id;

    const sensor = await SensorSchema.findOne({ _id: sensor_id });
    if (!sensor) {
        return res.render('sensor_info', {
            styles: ["sensor_info_page.css"],
        });
    }

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const data = await SensorDataSchema.find({ token: sensor.token, createdAt: {$gte: thirtyMinutesAgo}}).sort({ createdAt: -1 });

    res.render('_sensors/sensor_info', {
        styles: ["sensor_info_page.css"],
        
        sensor,
        data,

        timeFormat: { hour: "numeric", minute: "numeric" },
        dateFormat: { year: "numeric", month: "numeric", day: "numeric" },

        dataTimeFormat: { hour: "numeric", minute: "numeric", second: "numeric" },
        dataDateFormat: { year: "numeric", month: "numeric", day: "numeric" }
    });
})

export default router;
