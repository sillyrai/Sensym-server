import mongoose, { Schema } from "mongoose";

const SensorDataSchema = new Schema({
    token: { type: String, required: true, index: true },
    data: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('SensorData', SensorDataSchema, 'sensorData');