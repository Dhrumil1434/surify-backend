import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "../utils/async_handler.js";
import handleError from "../utils/error_handler.js";
const authMiddleware = asyncHandler(async (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer <token>"
    if (!token) {
        throw new Error("Access denied. No token provided.");
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the token's payload
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error("User not found.");
        }

        // Attach the user to the request object
        req.user = user;

        // Call the next middleware or controller
        next();
    } catch (error) {
        return handleError(res,401,"Invalid Token");
       
    }
});

export default authMiddleware;
