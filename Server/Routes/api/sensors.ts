import { Router } from "express";
import IsAuthenticated from "../../Middleware/IsAuthenticated";
import TextStuff from "../../Modules/TextStuff";
import SensorSchema from "../../Models/SensorSchema";
import SensorDataSchema from "../../Models/SensorDataSchema";
let router = Router();

// Create a new sensor internally
// It's token can be used to post data to the server from the actual sensor
router.post('/newSensor', IsAuthenticated, async (req, res) => {
    if(res.locals.user.userType !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
    }

    let deviceToken = TextStuff.rndStr(16);
    let insertRes = await SensorSchema.insertOne({
        token: deviceToken
    })
    return res.status(200).json({
        token: deviceToken
    });
})

// Post sensor data

/*
SensorDataDocument {
    token: string;
    data: any[];
    createdAt: Date;
}

Example POST body:
[
    {"type": "temperature", "values": [43,23,5,43,45]},
    {"type": "humidity", "values": [23,45,12,34,23]}
]
*/
router.post('/:sensorToken', async (req,res)=>{
    // check if sensor token even exists
    let sensor = await SensorSchema.findOne({token: req.params.sensorToken});
    if(!sensor){
        return res.status(404).json({message: 'Sensor not found'});
    }

    // process sensor data
    SensorDataSchema.insertOne({
        token: req.params.sensorToken,
        data: req.body
    }).then(()=>{
        return res.status(200).json({message: 'Data recorded successfully'});
    }).catch((err)=>{
        return res.status(500).json({message: 'Failed to record data', details: err});
    })
})

router.delete('/:sensorToken', IsAuthenticated, async (req, res) => {
    if(res.locals.user.userType !== 'ADMIN') {
        return res.status(403).json({ error: 'Insufficient permissions' });
    }
    let deleteRes = await SensorSchema.deleteOne({ token: req.params.sensorToken });
    if(deleteRes.deletedCount === 0) {
        return res.status(404).json({ error: 'Sensor not found' });
    }
    return res.status(200).json({ message: 'Sensor deleted successfully' });
});

export default router;
