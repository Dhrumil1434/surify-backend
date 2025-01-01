import express from "express";
import { registerUser,loginUser } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// Route for user registration
router.post("/register", registerUser);
router.get("/login",loginUser);
router.get("/protected-route", authMiddleware, (req, res) => {
    res.status(200).json({ message: "Access granted", user: req.user });
});
export default router;
