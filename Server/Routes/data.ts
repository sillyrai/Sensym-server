import { Router } from "express";

import SensorDataSchema from "../MongoDB models/SensorData_Schema";

const router = Router();

router.get("/", async (req, res) => {
    const data = await SensorDataSchema.aggregate([
        {
            $lookup: {
                from: "sensors",          // collection name in MongoDB
                localField: "token",      // field in data collection
                foreignField: "token",    // field in sensors collection
                as: "sensor"
            }
        },
        {
            $unwind: "$sensor"          // convert array to object
        },
        {
            $project: {
                token: 1,
                dataType: 1,
                value: 1,
                createdAt: 1,
                name: "$sensor.name"      // include sensor name
            }
        },
        {
            $sort: { createdAt: -1 }     // earliest first
        },
        {
            $limit: 100                  // limit results to 100 records
        }
    ]);

    res.render('data', {
        styles: ["data_table.css"],
        data: data,
        timeFormat: { hour: "numeric", minute: "numeric", second: "numeric" },
        dateFormat: { year: "numeric", month: "numeric", day: "numeric" }
    });
})

export default router;
