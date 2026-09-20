import app from "../app.js";
import { genrateHash, verifyHash } from "../Config/bcrypt.js";
import { genrateToken } from "../Config/jwt.js";
import userModel from "../models/userModel.js";
import { ApiResponse } from "../utils/resPattern.js"

export async function authCantroller(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json(new ApiResponse(false, null, "Email and pass required"));
        }
        let user = await userModel.findOne({ email });
        if (!user) return res.status(404).json(new ApiResponse(false, null, "user not found"))

         user = user.toObject();

        let match = await verifyHash(password, user.password);

        if (!match) return res.status(401).json(new ApiResponse(false, null, "incorrect password"))

        let accessToken = genrateToken({
            name: user.name,
            id: user._id,
            role: user.role,
            email: user.email
        })
        
        delete user._v
        delete user.password

        user.accessToken = accessToken;

        res.status(200).json(new ApiResponse(true, user, "success"));

    }
    catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "internal server error"));
    }
}