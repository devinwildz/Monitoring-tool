import mongoose, { Schema } from 'mongoose'

const planSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            enum: ["free", "basic", "pro"],
        },
        price: {
            type: Number, // ₹ rupees or paise based on Razorpay config
            required: true,
        },
        durationInDays: {
            type: Number,
            required: true, // e.g., 30, 365
        },
        monitorLimit: {
            type: Number,
            default: 3,
        },
        features: {
            type: [String], // e.g., ["uptime monitoring", "email alerts"]
        },
        isActive: {
            type: Boolean,
            default: true,
        },

    }, {
    timestamps: true,
})



export const Plan = mongoose.model("Plan", planSchema);