// models/NotificationLog.js
import mongoose from "mongoose";

const notificationLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    monitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
    },
    type: {
      type: String,
      enum: ["email", "sms", "whatsapp"],
    },
    status: {
      type: String,
      enum: ["success", "failed"],
    },
    message: String,
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const NotificationLog = mongoose.model("NotificationLog", notificationLogSchema);
