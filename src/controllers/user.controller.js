import User from "../models/user.model.js";
import asyncHandler from "../utils/async_handler.js";
import handleError from "../utils/error_handler.js";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, phoneNumber, password, type } = req.body;
  
    // Ensure email or phoneNumber is provided
    if (!username || !password || (!email && !phoneNumber)) {
      return handleError(res, 400, "Username, password, and either email or phone number are required.");
    }
  
    // Validate email format if provided
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return handleError(res, 400, "Please enter a valid email address.");
      }
    }
  
    // Validate phone number format if provided
    if (phoneNumber) {
      const phoneRegex = /^\+?[1-9]\d{1,4}(\s?\(?\d{1,3}\)?[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return handleError(res, 400, "Please enter a valid phone number with country code.");
      }
    }
  
    // Check if the email already exists
    if (email) {
      const userExistByEmail = await User.findOne({ email });
      if (userExistByEmail) {
        return handleError(res, 402, "User already exists with the given email.");
      }
    }
  
    // Check if the phone number already exists
    if (phoneNumber) {
      const userExistByPhone = await User.findOne({ phoneNumber });
      if (userExistByPhone) {
        return handleError(res, 402, "User already exists with the given phone number.");
      }
    }
  
    // Create a new user
    const newUser = new User({
      username,
      email,
      phoneNumber,
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

  // Find the user by email or phone number
  const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (!user) {
    return handleError(res, 403, "User with entered email or phone number is not found");
  }

  // Check password match
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return handleError(res, 403, "Invalid Password");
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Send response with token
  res.status(200).json({ message: "Login successful", token, type: `${user.type}` });
});
