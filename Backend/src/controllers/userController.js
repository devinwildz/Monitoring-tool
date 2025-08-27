import bcrypt from 'bcryptjs';
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/SendEmail.js";
import apiErrors from "../utils/apiErrors.js";
import { User } from "../models/userModel.js";
import logger from "../utils/logger.js";
import { generateAndSetTokens } from '../utils/tokenUtils.js';
import jwt from 'jsonwebtoken';
import { PendingUser } from '../models/PendingUser.js';


const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000));

const OTP_EXPIRE_MINUTES = Number(process.env.OTP_EXPIRE_MINUTES) || 5;
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60;
const RESET_TOKEN_EXPIRE_MINUTES = Number(process.env.RESET_TOKEN_EXPIRE_MINUTES) || 30;



const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // 🛑 Validate required fields
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
        logger.warn("Register failed: Missing fields", { name, email });
        throw apiErrors(400, "Name, email, and password are required", { code: "MISSING_FIELDS" });
    }

    // 📧 Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        logger.warn(`Register failed: Invalid email format - ${email}`);
        throw apiErrors(400, "Invalid email format");
    }

    // 📏 Validate name and password length
    if (name.trim().length < 5) {
        logger.warn(`Register failed: Name too short - ${name}`);
        throw apiErrors(400, "Name must be at least 5 characters long");
    }

    if (password.length < 6) {
        logger.warn("Register failed: Password too short");
        throw apiErrors(400, "Password must be at least 6 characters long");
    }
    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        logger.warn(`Register failed: User already exists - ${email}`);
        throw apiErrors(409, "User already exists", { code: "USER_EXISTS" });
    }

    // Delete any existing pending user (for resend or cleanup)
    await PendingUser.findOneAndDelete({ email });

    

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtpCode();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpires = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

        const pendingUser = await PendingUser.create({
            name,
            email,
            password: hashedPassword,
            emailOTP: hashedOtp,
            emailOTPExpires: otpExpires,
            otpRequestCount: 1,
        });

        await sendEmail({
            email,
            subject: `${process.env.APP_NAME || "MonitorPro"} - Verify your email`,
            message: `Your verification code is ${otp}. It will expire in ${OTP_EXPIRE_MINUTES} minutes.`,
        });
        logger.info(`OTP sent to ${email}`);

        return res.status(201).json({
            success: true,
            message: "OTP sent to email. Please verify to complete registration.",
            pendingUserId: pendingUser._id,
        });

    } catch (err) {
        logger.error(`Failed to send OTP to ${email}: ${err.message}`);
        throw apiErrors(500, "Failed to send verification email");
    }
});


const verifyEmailOTP = asyncHandler(async (req, res) => {
    const { pendingUserId, otp } = req.body;
    if (!pendingUserId || !otp) throw apiErrors(400, "pendingUserId and otp are required");

    const pendingUser = await PendingUser.findById(pendingUserId).select("+emailOTP +password");
    if (!pendingUser) throw apiErrors(404, "Pending user not found or already verified");

    if (new Date() > pendingUser.emailOTPExpires) {
        await PendingUser.findByIdAndDelete(pendingUserId);
        throw apiErrors(400, "OTP expired. Please register again.");
    }

    const isValidOtp = await bcrypt.compare(String(otp).trim(), pendingUser.emailOTP);
    if (!isValidOtp) throw apiErrors(400, "Invalid OTP");

    // ✅ Create final verified user without rehashing password
    const user = new User({
        name: pendingUser.name,
        email: pendingUser.email.toLowerCase(),
        password: pendingUser.password, // already hashed
        isEmailVerified: true,
    });
    user.isModified = () => false; // skip pre-save hook
    await user.save({ validateBeforeSave: false });

    // Delete pending user record
    await PendingUser.findByIdAndDelete(pendingUserId);

    // Generate tokens and set cookies
    const { accessToken, refreshToken } = await generateAndSetTokens(user, res);

    logger.info(`User ${user.email} verified email and account created`);

    res.status(201).json({
        success: true,
        message: "Email verified and account created successfully",
        user: await User.findById(user._id).select("-password -refreshToken"),
        accessToken,
        refreshToken,
    });
});


// RESEND OTP for pending user
const resendEmailOTP = asyncHandler(async (req, res) => {
    const { pendingUserId } = req.body;
    if (!pendingUserId) throw apiErrors(400, "pendingUserId is required");

    const pendingUser = await PendingUser.findById(pendingUserId);
    if (!pendingUser) throw apiErrors(404, "Pending user not found");

    if (pendingUser.emailOTPExpires) {
        const otpExpiryMs = OTP_EXPIRE_MINUTES * 60 * 1000;
        const lastSentAt = new Date(pendingUser.emailOTPExpires).getTime() - otpExpiryMs;
        const sinceLastSentSec = (Date.now() - lastSentAt) / 1000;
        if (sinceLastSentSec < OTP_RESEND_COOLDOWN_SECONDS) {
            const wait = Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - sinceLastSentSec);
            throw apiErrors(429, `Please wait ${wait}s before requesting a new OTP`);
        }
    }

    const otp = generateOtpCode();
    pendingUser.emailOTP = await bcrypt.hash(otp, 10);
    pendingUser.emailOTPExpires = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);
    pendingUser.otpRequestCount = (pendingUser.otpRequestCount || 0) + 1;

    await pendingUser.save({ validateBeforeSave: false });

    try {
        await sendEmail({
            email: pendingUser.email,
            subject: `${process.env.APP_NAME || "MonitorPro"} - Your new verification code`,
            message: `Your new verification code is ${otp}. It will expire in ${OTP_EXPIRE_MINUTES} minutes.`,
        });
        logger.info(`Resent OTP to ${pendingUser.email}`);
        res.status(200).json({ success: true, message: "OTP resent successfully" });
    } catch (err) {
        logger.error(`Failed to resend OTP to ${pendingUser.email}: ${err.message}`);
        pendingUser.emailOTP = undefined;
        pendingUser.emailOTPExpires = undefined;
        await pendingUser.save({ validateBeforeSave: false });
        throw apiErrors(500, "Failed to send OTP email");
    }
});

//LOGIN USER

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        logger.warn("Login failed: field can't be empty", { email });
        throw apiErrors(400, "Fields are required");
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        throw apiErrors(404, "User does not exist", { code: "USER_NOT_FOUND" });
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
        throw apiErrors(401, "Invalid User Credentials")
    }

    const { accessToken, refreshToken } = await generateAndSetTokens(user, res)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
    }

    return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            {
                success: true,
                message: "User Logged In Successfully",
                user: loggedInUser,
                accessToken,
                refreshToken
            }
        )
});


// LOGOUT USER


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, {
        $unset: {
            refreshToken: 1
        }
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            {
                success: true,
                message: "User Logged Out Successfully",
            }
        )
});


const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw apiErrors(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw apiErrors(404, "User not found");

    const otp = generateOtpCode();
    user.resetPasswordToken = await bcrypt.hash(otp, 10);
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_EXPIRE_MINUTES * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user.email,
        subject: `${process.env.APP_NAME || "App"} - Password reset code`,
        message: `Your password reset code is ${otp}. It expires in ${RESET_TOKEN_EXPIRE_MINUTES} minutes.`,
    });
    logger.info(`Password reset OTP sent to ${user.email}`);

    res.status(200).json({ success: true, message: "Password reset OTP sent" });
});


// RESET PASSWORD
const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) throw apiErrors(400, "Email, OTP and new password are required");

    const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpires");
    if (!user) throw apiErrors(404, "User not found");

    if (!user.resetPasswordToken || !user.resetPasswordExpires) throw apiErrors(400, "No reset token found. Request new OTP.");
    if (new Date() > user.resetPasswordExpires) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw apiErrors(400, "Reset token expired. Request new OTP.");
    }

    const isValidOtp = await bcrypt.compare(String(otp).trim(), user.resetPasswordToken);
    if (!isValidOtp) throw apiErrors(400, "Invalid OTP");

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(`User ${user.email} reset password successfully`);

    res.status(200).json({ success: true, message: "Password reset successfully" });
});

// REFRESH ACCESS TOKEN
const RefreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw apiErrors(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.JWT_REFRESH_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw apiErrors(401, "Invalid refresh Token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw apiErrors(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        }

        const { accessToken, refreshToken } = await generateAndSetTokens(user, res)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                {
                    success: true,
                    message: "Access token refreshed successfully",
                }
            )
    } catch (error) {
        throw apiErrors(401, error?.message || "Invalid refresh Token")
    }
});

export { registerUser, loginUser, logoutUser, RefreshAccessToken, verifyEmailOTP, resendEmailOTP, forgotPasswordRequest, resetPassword };
