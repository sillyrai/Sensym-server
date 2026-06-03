import { Router } from "express";

import SensorSchema from "../Lib/mongoDB_models/Sensor_Schema";
import SensorDataSchema from "../Lib/mongoDB_models/SensorData_Schema";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const data = await SensorSchema.find({}).limit(24);

        res.render('_sensors/sensors', {
            styles: ["sensors_page.css"],
            title: "Sensym | Sensors",

            sensors: data
        });
    } catch (err) {
        console.error('Sensors list render failed:', err);
        return res.status(500).render('error', {
            styles: ["error.css"],
            message: 'Failed to load sensors'
        });
    }
})

//-// This '/add' route MUST BE before '/:sensor_id' <-- IMPORTANT IMPORTANT //-//
router.get("/add", async (req, res) => {    
    try {
        res.render('_sensors/page_add_sensor', {
            styles: ["page_add_sensor.css"],
            title: "Sensym | Add Sensor",
            authToken: req.cookies.auth_token || "",
        });
    } catch (err) {
        console.error('Add sensor page render failed:', err);
        return res.status(500).render('error', {
            styles: ["error.css"],
            message: 'Failed to load add sensor page'
        });
    }
})

router.get("/:sensor_id", async (req, res) => {
    try {
        const sensor_id = req.params.sensor_id;

        const sensor = await SensorSchema.findOne({ _id: sensor_id });
        if (!sensor) {
            return res.render('sensor_info', {
                styles: ["sensor_info_page.css"],
            });
        }

        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const data = await SensorDataSchema
            .find({ sensor: sensor.id, createdAt: {$gte: thirtyMinutesAgo}})
            .select("data createdAt -_id")
            .sort({ createdAt: -1 });
        const allData = await SensorDataSchema
            .find({ sensor: sensor.id })
            .select("data createdAt -_id")
            .sort({ createdAt: 1 });

        res.render('_sensors/sensor_info', {
            styles: ["sensor_info_page.css"],
            title: "Sensym | Sensor",
            
            sensor,
            data,
            allData,

            timeFormat: { hour: "numeric", minute: "numeric" },
            dateFormat: { year: "numeric", month: "numeric", day: "numeric" },

            dataTimeFormat: { hour: "numeric", minute: "numeric", second: "numeric" },
            dataDateFormat: { year: "numeric", month: "numeric", day: "numeric" }
        });
    } catch (err) {
        console.error('Sensor detail render failed:', err);
        return res.status(500).render('error', {
            styles: ["error.css"],
            message: 'Failed to load sensor details'
        });
    }
})

export default router;
