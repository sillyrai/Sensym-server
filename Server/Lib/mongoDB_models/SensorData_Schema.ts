import mongoose, { Schema } from "mongoose";

const SensorDataSchema = new Schema({
    token: { type: String, required: true },
    dataType: { type: String, required: true },
    value: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

SensorDataSchema.index({ token: 1, createdAt: -1 });

export default mongoose.model('SensorData', SensorDataSchema, 'sensorData');
