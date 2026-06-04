/*
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
*/