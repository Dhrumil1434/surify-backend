import express from "express";
import { registerUser,loginUser } from "../controllers/user.controller.js";

const router = express.Router();

// Route for user registration
router.post("/register", registerUser);
router.get("/login",loginUser);
export default router;
