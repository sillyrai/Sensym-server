import mongoose, { Schema } from "mongoose";

const SensorSchema = new Schema({
    token: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: 'Unnamed Sensor' },
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Sensor', SensorSchema, 'sensors');