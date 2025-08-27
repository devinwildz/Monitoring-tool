// models/paymentLogModel.js
import mongoose from "mongoose";

const paymentLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "basic", "pro"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["success", "failed", "refunded", "cancelled"],
      required: true,
    },
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,

    error: {
      type: String, // Razorpay error (if any)
    },
  },
  {
    timestamps: true,
  }
);

const PaymentLog = mongoose.model("PaymentLog", paymentLogSchema);
export default PaymentLog;
