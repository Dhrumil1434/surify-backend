import User from "../models/user.model.js";
import asyncHandler from "../utils/async_handler.js";
import handleError from "../utils/error_handler.js";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, password, type } = req.body;

  // Ensure either email or phone number is provided
  if (!username || !password || (!email && !phoneNumber)) {
    return handleError(res, 400, "Username, password, and either email or phone number are required.");
  }

  // Check if the email or phone number already exists
  const userExistByEmail = email && (await User.findOne({ email }));
  const userExistByPhone = phoneNumber && (await User.findOne({ phoneNumber }));

  if (userExistByEmail) {
    return handleError(res, 402, "User already exists with the given email.");
  }
  if (userExistByPhone) {
    return handleError(res, 402, "User already exists with the given phone number.");
  }

  // Create a new user
  const newUser = new User({
    username,
    email,
    phoneNumber: phoneNumber || null, // If phoneNumber is not provided, set it to null
    password,
    type,
  });

  // Save user to the database
  await newUser.save();

  // Send success response
  res.status(201).json({ message: "User registered successfully" });
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  // Ensure email or phone number and password are provided
  if ((!email && !phoneNumber) || !password) {
    return handleError(res, 400, "Please provide either email or phone number and password.");
  }

  // Find user by email or phone number
  let user;
  if (email) {
    user = await User.findOne({ email });
  } else if (phoneNumber) {
    user = await User.findOne({ phoneNumber });
  }

  if (!user) {
    return handleError(res, 404, "User not found.");
  }

  // Compare the entered password with the stored hashed password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return handleError(res, 401, "Invalid credentials.");
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username, type: user.type },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Send response with token
  res.status(200).json({
    message: "Login successful",
    token,
    user: { username: user.username, type: user.type },
  });
});