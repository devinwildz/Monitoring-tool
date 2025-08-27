import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 5, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    emailOTP: { type: String, required: true },
    emailOTPExpires: { type: Date, required: true },
    otpRequestCount: { type: Number, default: 1 },
}, { timestamps: true });

export const PendingUser = mongoose.model("PendingUser", pendingUserSchema);
