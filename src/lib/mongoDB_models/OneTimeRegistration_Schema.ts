import mongoose, { Schema } from "mongoose";

const OneTimeRegistrationSchema = new Schema({
    token: { type: String, required: true },
    accountType: { type: String, required: true, enum: ["USER", "ADMIN"] },
    expiresAt: { type: Date, dwefault: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }
}, { 
    timestamps: true, 
    versionKey: false
})

// Automatically delete after expires
OneTimeRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Index token for faster lookup
OneTimeRegistrationSchema.index({ token: 1 });

export default mongoose.model('OneTimeRegistration', OneTimeRegistrationSchema, 'oneTimeRegistrations');
