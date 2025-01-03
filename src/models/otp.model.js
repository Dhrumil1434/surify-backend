import mongoose, { Types } from "mongoose";

const otpSchema = new mongoose.Schema(

    {
        userId: {
            type: mongoose.Schema.Types.ObjectId , 
            ref: "User",
            required:true
        },
        otp: 
        {
            type: String,
            required: true
        },
        createdAt: { type: Date, default: Date.now, expires: 300 }

    }
);

const OTP =  mongoose.model('OTP', otpSchema);
export default OTP;