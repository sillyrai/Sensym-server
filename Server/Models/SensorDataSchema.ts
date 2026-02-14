import mongoose, { Schema } from "mongoose";

const SensorDataSchema = new Schema({
    token: { type: String, required: true, index: true },
    type: { type: String, required: true },
    value: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('SensorData', SensorDataSchema, 'sensorData');