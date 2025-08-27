// models/Subscription.js
import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    razorpaySubscriptionId: String,
    planName: {
      type: String,
      enum: ["free", "basic", "pro"],
    },
    status: {
      type: String,
      enum: ["created", "active", "cancelled", "expired"],
      default: "created",
    },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;
