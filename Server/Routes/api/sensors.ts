import { Router } from "express";
import IsAuthenticated from "../../Lib/backend_auth";
import TextStuff from "../../Lib/TextStuff";
import SensorSchema from "../../Lib/mongoDB_models/Sensor_Schema";
import SensorDataSchema from "../../Lib/mongoDB_models/SensorData_Schema";
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

router.post('/:sensorToken', async (req,res)=>{
    // check if sensor token even exists
    let sensor = await SensorSchema.findOne({token: req.params.sensorToken});
    if(!sensor){
        return res.status(404).json({message: 'Sensor not found'});
    }

    // process sensor data
    SensorDataSchema.insertOne({
        token: req.params.sensorToken,
        dataType: req.body.type,
        value: req.body.value

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
/*
router.post('/:sensorToken/heartbeat', async (req, res) => {
    let sensorToken = req.params.sensorToken;
    if(!sensorToken) {
        return res.status(400).json({ message: 'Sensor token is required' });
    }
    
    let sensor = await SensorSchema.findOne({ token: sensorToken });
    if(!sensor) {
        return res.status(404).json({ message: 'Sensor not found' });
    }
    
    // TODO: Unsure how to proceed from here, Ghoosts todo list wasnt very clear on this part.
});
*/
export default router;
