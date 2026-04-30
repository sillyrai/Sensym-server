import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: Date, default: Date.now },
    userType: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
})

export default mongoose.model('User', UserSchema, 'users');