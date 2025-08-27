import mongoose, { Schema } from "mongoose";

const historySchema = new Schema(
    {
        checkedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ["up", "down"], required: true },
        responseTime: { type: Number, default: null },
    },
    { _id: false }
);


const monitorSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        
        
        url: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (value) {
                    // Simple URL regex check
                    return /^(https?:\/\/)[\w.-]+(\.[\w\.-]+)+[/#?]?.*$/.test(value);
                },
                message: "Please enter a valid URL.",
            },
        },
        name: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: ["up", "down"],
            default: "up",
        },
        lastChecked: {
            type: Date,
            default: null,
        },
        frequency: { type: Number, default: 3 }, // in minutes
        uptime: { type: Number, default: 100 }, // percentage
        responseTime: { type: Number, default: null }, // last response time
        history: [historySchema],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Compound index to ensure each user can't create duplicate URL monitors
monitorSchema.index({ userId: 1, url: 1 }, { unique: true });

export const Monitor = mongoose.model("Monitor", monitorSchema);
