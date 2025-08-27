import { asyncHandler } from "../utils/asyncHandler.js";
import apiErrors from "../utils/apiErrors.js";
import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {

            throw apiErrors(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken?.userId).select("-password -refreshToken")

        if (!user) {

            throw apiErrors(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw apiErrors(401, error?.message || "invalid access token")
    }
})