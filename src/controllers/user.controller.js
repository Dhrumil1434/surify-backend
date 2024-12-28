import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/async_handler.js";
import handleError from "../utils/error_handler.js";
export const  registerUser = asyncHandler(async (req,res)=>{
         
    const {username,email,phoneNumber,password} = req.body;

    //checking that if any empty value is passed or not 
    if(!username || !email || !phoneNumber || !password)
    {
        handleError(401,"all fields are required ");
    }

    //check that user is already registered or not 
    const user_exist = User.findOne({$or : [{email},{phoneNumber}]});
    if(user_exist)
    {
        handleError(402,"user is already exist with given number or an email");
    }
    const newUser = new User({ username, email, phoneNumber, password });
    newUser.save();

    res.status(201,"user Registered successfully");

});