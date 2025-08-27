import mongoose, { Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: 5,
        lowercase: true,
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },

    emailOTP: {
        type: String,
        select: false,
    },
    emailOTPExpires: {
        type: Date,
        select: false,
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        select: false,
    },

    resetPasswordToken: {
        type: String,
        select: false,
    },

    resetPasswordExpires: {
        type: Date,
        select: false,
    },

    refreshToken: {
        type: String, // Optional: for persistent login sessions
        select: false,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },

    monitorLimit: {
        type: Number,
        default: 3, // For "free"
    },
    monitorsUsed: {
        type: Number,
        default: 0,
    },

    otpRequestCount: {
        type: Number,
        default: 0
    },

    subscription: {
        plan: {
            type: String,
            enum: ["free", "basic", "pro"],
            default: "free",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "canceled"],
            default: "inactive",
        },
        razorpaySubscriptionId: String,
        startDate: Date,
        endDate: Date,
        currentPeriodEnd: Date, // Razorpay/Stripe give this
    },

    isEmailVerified: {
        type: Boolean,
        default: false,
    },

},
    {
        timestamps: true,
    });


userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
// 🔐 Compare password method
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { userId: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}


export const User = mongoose.model("User", userSchema)