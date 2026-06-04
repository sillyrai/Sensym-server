import { Router } from "express";
import IsAuthenticated from "../../lib/backend_auth";
import TextStuff from "../../lib/TextStuff";
import SensorSchema from "../../lib/mongoDB_models/Sensor_Schema";
import SensorDataSchema from "../../lib/mongoDB_models/SensorData_Schema";
import { validateShortText } from "../../lib/validation";
let router = Router();

// Create a new sensor internally
// It's token can be used to post data to the server from the actual sensor
router.post('/newSensor', IsAuthenticated, async (req, res) => {
    try {
        if(res.locals.user.userType !== 'ADMIN') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        let body = req.body || {};
        let sensorName = body.sensor_name;

        if(!sensorName) {
            return res.status(400).json({ error: 'Sensor name is required' });
        }

        if (validateShortText(sensorName)) {
            return res.status(400).json({ error: 'Sensor name must be 20 characters or less and can only contain letters, numbers, and underscores' });
        }

        let deviceToken = TextStuff.rndStr(16);
        await SensorSchema.insertOne({
            token: deviceToken,
            name: sensorName
        })
        return res.redirect('/sensors');
    } catch (err) {
        console.error('Create sensor request failed:', err);
        return res.status(500).json({ error: 'Failed to create sensor' });
    }

    // at the end redirect back to '/sensors/<ID_of_new_sensor>'
})

// Post sensor data

interface SensorDataItem {
    type: string;
    value: string;
    name?: string;
}

router.post('/:sensorToken', async (req, res)=>{
    try {
        const { sensorToken } = req.params;

        // check if sensor token even exists
        const sensor = await SensorSchema.findOne({ token: sensorToken });
        if(!sensor){ return res.status(404).json({ message: "Sensor not found" }); }

        // process sensor data
        /* << OLD >> *//*
        SensorDataSchema.insertOne({
            token: req.params.sensorToken,
            dataType: req.body.type,
            value: req.body.value

        }).then(()=>{
            return res.status(200).json({message: 'Data recorded successfully'});
        }).catch((err)=>{
            return res.status(500).json({message: 'Failed to record data', details: err});
        })
        */
        const newData = (req.body as SensorDataItem[] || []).map((item:SensorDataItem) => ({
            type: item.type,
            value: item.value,
            ...(item.name && { name: item.name })
        }))

        await SensorDataSchema.insertOne({
            sensor: sensor.id,
            data: newData,
        }).then(()=>{
            return res.status(200).json({ ok: 'data recorded successfully' });
        }).catch((err)=>{
            return res.status(500).json({ error: `failure to record data: ${err}` });
        });

        // Send out the new data
        const io = req.app.get('socketio');
        io.to(sensor.id).emit('new_sensor_data', {
            data: newData,
            createdAt: Date.now()
        });
    } catch (err) {
        console.error('Sensor data post failed:', err);
        return res.status(500).json({ message: 'Failed to record sensor data' });
    }
})

router.delete('/:sensorToken', IsAuthenticated, async (req, res) => {
    try {
        if(res.locals.user.userType !== 'ADMIN') {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        let deleteRes = await SensorSchema.deleteOne({ token: req.params.sensorToken });
        if(deleteRes.deletedCount === 0) {
            return res.status(404).json({ error: 'Sensor not found' });
        }
        return res.status(200).json({ message: 'Sensor deleted successfully' });
    } catch (err) {
        console.error('Sensor delete failed:', err);
        return res.status(500).json({ error: 'Failed to delete sensor' });
    }
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
