// models/UptimeLog.js
import mongoose from "mongoose";

const uptimeLogSchema = new mongoose.Schema(
  {
    monitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },
    status: {
      type: String,
      enum: ["up", "down"],
      required: true,
    },
    checkedAt: {
      type: Date,
      default: Date.now,
    },
    responseTime: Number,
  },
  { timestamps: true }
);

const UptimeLog = mongoose.model("UptimeLog", uptimeLogSchema);
export default UptimeLog;
