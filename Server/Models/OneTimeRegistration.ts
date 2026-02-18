import mongoose, { Schema } from "mongoose";

const OneTimeRegistrationSchema = new Schema({
    token: { type: String, required: true },
    accountType: { type: String, required: true }, // "USER" or "ADMIN"
}, { timestamps: true, versionKey: false})

OneTimeRegistrationSchema.index({ token: 1, createdAt: -1 });

export default mongoose.model('OneTimeRegistration', OneTimeRegistrationSchema, 'oneTimeRegistrations');