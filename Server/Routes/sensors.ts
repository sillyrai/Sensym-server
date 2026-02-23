import { Router } from "express";

import SensorSchema from "../Lib/mongoDB_models/Sensor_Schema";
import SensorDataSchema from "../Lib/mongoDB_models/SensorData_Schema";

const router = Router();

router.get("/", async (req, res) => {
    const data = await SensorSchema.find({}).limit(25);

    res.render('_sensors/sensors', {
        styles: ["sensors_page.css"],
        sensors: data
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

    var data = await SensorDataSchema.find({ token: sensor.token }).sort({ createdAt: -1 }).limit(50);

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
