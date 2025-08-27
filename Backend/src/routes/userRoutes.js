import { Router } from "express"
import { loginUser, logoutUser, registerUser, RefreshAccessToken,verifyEmailOTP, resendEmailOTP, forgotPasswordRequest, resetPassword } from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/authMiddlewares.js";

const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)
router.route("/verify-email-otp").post(verifyEmailOTP);
router.route("/resend-email-otp").post(resendEmailOTP);
router.route("/forgot-password").post(forgotPasswordRequest);
router.route("/reset-password").post(resetPassword);


//secured routes

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(RefreshAccessToken)


export default router