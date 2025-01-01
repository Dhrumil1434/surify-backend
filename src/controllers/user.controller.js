import User from "../models/user.model.js";
import asyncHandler from "../utils/async_handler.js";
import handleError from "../utils/error_handler.js";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, phoneNumber, password ,type} = req.body;

    // Check that all required fields are provided
      if (!username || !password || (!email && !phoneNumber)) {
        return handleError(res, 400, "All fields are required and either email or phone number must be provided");
    }

     // Email validation (regex for valid email format)
     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     if (email && !emailRegex.test(email)) {
         return handleError(res, 400, "Please enter a valid email address");
     }
 
     // Phone number validation (regex for phone number with country code)
     const phoneRegex = /^\+?[1-9]\d{1,4}(\s?\(?\d{1,3}\)?[\s.-]?)?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,4}$/;
     if (phoneNumber && !phoneRegex.test(phoneNumber)) {
         return handleError(res, 400, "Please enter a valid phone number with country code");
     }
 
     // Password validation (minimum 8 characters, at least one lowercase, one uppercase, one number, and one special character)
     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
     if (!passwordRegex.test(password)) {
         return handleError(res, 400, "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character (e.g., @, #, $, etc.)");
     }
 
 

    // Check if the user already exists
    const userExist = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (userExist) {
        return handleError(res, 402, "User already exists with the given email or phone number");
    }

    // Create a new user
    const newUser = new User({ username, email, phoneNumber, password,type });

    // Save the user
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: ` registered successfully` });
});

export const loginUser = asyncHandler(async (req,res)=>{
    const {email,phoneNumber,password}=req.body;

    const user = await User.findOne({$or : [{email},{phoneNumber}]});
    if(!user)
    {
        return handleError(res,403,"User with entered email or phone number is not found ");
    }
    const ismatch = await user.matchPassword(password);
    if(!ismatch)
    {
        return handleError(res,403,"Invalid Password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token , type: `${user.type}`});

});