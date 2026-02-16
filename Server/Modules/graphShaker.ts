import mongoose from "mongoose";

import SensorDataSchema from "../Models/SensorDataSchema";
import SensorSchema from "../Models/SensorSchema";

// Types

interface SensorDataPoint {
    time: Date;
    value: number;
}
interface Sensor {
    sensorID: string;
    sensorName: string;
    earliest: Date;
    latest: Date;
    dataType: string;
    data: SensorDataPoint[];
}

/* 
I would burn it all down. Make It crumble to dust by my own hand, if given the 
chance to sin so. Not a concept would remain. Then lay alone in the ashen land
for eternity would I. 
Oh how beutiful that could have been.
How excruciatingly lonely that would be...
May Gods lay witness to madness man is capable of and be incable to judge as a
witness harbors the same sins as the perpetrator.
"Look down on me and frown."
*/

/* Learning JS classes as TS types

type SensymGraphX = "time";
type SensymGraphY = "temperature" | "brightness";

class SensymGraph {
    #typeX:SensymGraphX;
    #typeY:SensymGraphY;

    constructor (y:SensymGraphY, x:SensymGraphX = "time") {
        this.#typeX = x;
        this.#typeY = y;
    }

    public changeX(x:SensymGraphX) { this.#typeX = x; }
    public changeY(y:SensymGraphY) { this.#typeY = y; }

    public average() {
        //
    }
}
*/

// Functions

async function sensorGrpahData (timeFrom:Date, timeTo:Date) {
    const sensorsList = ["698b0d5f1d80b557bf1b8110"];
    // const timeFrom = new Date(Date.now() - 30 * 60 * 1000);
    // const timeTo = new Date();

    const ObjectId = mongoose.Types.ObjectId;
    const sensorIds = sensorsList.map(id => new ObjectId(id));

    const sensorDocs = await SensorSchema.find(
        { _id: { $in: sensorIds } },
        { token: 1, name: 1 }
    ).lean();

    const tokenMap = new Map(sensorDocs.map(s => [s.token, s]));
    const tokens = sensorDocs.map(s => s.token);

    const data = await SensorDataSchema.aggregate([
        {
            $match: {
                token: { $in: tokens },
                createdAt: { $gte: timeFrom, $lte: timeTo }
            }
        },
        { $sort: { createdAt: 1 } },
        {
            $group: { // actual structure of the each sensors output
                _id: "$token",
                dataType: { $first: "$dataType" },
                minValue: { $min: "$value" },
                maxValue: { $max: "$value" },
                data: {
                    $push: {
                        time: "$createdAt",
                        value: "$value"
                    }
                }
            }
        }
    ]);

    const stats = data.map(r => ({
        sensorID: tokenMap.get(r._id)?._id,
        sensorName: tokenMap.get(r._id)?.name,
        earliest: timeFrom,
        latest: timeTo,
        dataType: r.dataType,
        data: r.data
    }));

    return stats;
}

interface lineGrapthModel {
    width:number
    height:number
    x:string
    y:string
    data:any[]
    verticals:number
    horizontals:number
    fontSize:number
}

function lineGrap(config:lineGrapthModel) {
    // Vertical grid lines
    /*/ Vertical lines every 5 minutes
    const fiveMin = 5 * 60 * 1000;
    const vLines = [];
    for (let t = start; t <= end; t += fiveMin) {
        vLines.push(((t - start) / (end - start)) * width);
    } */

    // Horizontal X grid lines
    for (let i:number = 0; i < config.height; i + config.height / (config.verticals + 1)) {
        // 
    }

    // Compute Y scaling
    const valuesY = config.data.map(d => d.value);
    const minY = Math.min(...valuesY);
    const maxY = Math.max(...valuesY);
    const rangeY = Math.floor(maxY - minY) + 2 || 1;

    // Compute X scaling
    const valuesX = config.data.map(d => d.value);
    const minX = Math.min(...valuesX);
    const maxX = Math.max(...valuesX);
    const rangeX = Math.floor(maxX - minX) + 2 || 1;

    const nameX = "time";
    const namey = "value";

    // Build data points and path
    let pathD = "";
    const points = config.data.map((d, i) => {
        const timestamp = new Date(d[nameX]).getTime();
        const x = ((timestamp - minX) / (maxX - minX)) * config.width;
        const y = config.height - ((d[namey] - minY) / rangeY) * config.height;

        if (i === 0) pathD += `M${x} ${y}`;
        else pathD += ` L${x} ${y}`;

        return { x, y };
    });

    return `
        <svg width="100%" height="100%" 
            viewbox="0 0 auto auto" 
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">

            <rect  width="${config.width}" height="${config.height}/">

        </svg>
    `;

};


/*
returns {
    grapth_width --> for graph vewbox
    graph_height --> for graph vewbox

    graph_line --> <path />
    graph_points --> [<circle />, ...]

    graph_verticals <g></g>
}
*/