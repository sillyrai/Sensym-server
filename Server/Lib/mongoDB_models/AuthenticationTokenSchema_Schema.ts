import mongoose, { Schema } from "mongoose";
import UserSchema from "./User_Schema";

const AuthTokenSchema = new Schema({
    token: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' }, // Token expires after 7 days
})

export default mongoose.model('AuthToken', AuthTokenSchema, 'authTokens');
