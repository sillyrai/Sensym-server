import { Router } from "express";
import mongoose from "mongoose";

import SensorDataSchema from "../Models/SensorDataSchema";
import SensorSchema from "../Models/SensorSchema";

const router = Router();

router.get("/", async (req, res) => {

    const sensorsList = ["698b0d5f1d80b557bf1b8110"];
    const timeFrom = new Date(Date.now() - 30 * 60 * 1000);
    const timeTo = new Date();

    const ObjectId = mongoose.Types.ObjectId;
    const sensorIds = sensorsList.map(id => new ObjectId(id));

    const sensorDocs = await SensorSchema.find(
        { _id: { $in: sensorIds } },
        { token: 1, name: 1 }
    ).lean();

    const tokenMap = new Map(
        sensorDocs.map(s => [s.token, s])
    );

    const tokens = sensorDocs.map(s => s.token);

    const stats = await SensorDataSchema.aggregate([
        {
            $match: {
                token: { $in: tokens },
                createdAt: { $gte: timeFrom, $lte: timeTo }
            }
        },
        { $sort: { createdAt: 1 } },
        {
            $group: {
                _id: "$token",
                dataType: { $first: "$dataType" },
                data: {
                    $push: {
                        time: "$createdAt",
                        value: "$value"
                    }
                }
            }
        }
    ]);

    const formatted = stats.map(r => ({
        sensorID: tokenMap.get(r._id)?._id,
        sensorName: tokenMap.get(r._id)?.name,
        dataType: r.dataType,
        data: r.data
    }));

    res.render('analytics', {
        styles: ["analytics_page.css"],
        stats: formatted
    });
})

export default router;