// models/adminLogModel.js
import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin user ka ref
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "delete_user",
        "suspend_monitor",
        "upgrade_plan",
        "refund_processed",
        "manual_email_verification",
        "create_plan",
        "delete_monitor",
        "update_user_role",
        "custom_action",
      ],
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // jis user pe action hua
    },
    details: {
      type: String, // Optional description or notes
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String, // From request.headers["user-agent"]
    },
  },
  {
    timestamps: true,
  }
);

const AdminLog = mongoose.model("AdminLog", adminLogSchema);
export default AdminLog;
