import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import { generateOTP } from "../utils/otp_generator.js";
import { sendEmail } from "../services/email.service.js";
import { sendSMS } from "../services/sms.service.js";

export const sendOTP = async (req, res) => {
    const { email, phoneNumber } = req.body;

    

    // Ensure that either email or phoneNumber is provided
    if (!email && !phoneNumber) {
        return res.status(400).json({ success: false, message: "Email or phone number is required" });
    }

    // Find the user by email or phone
    let user = null;
    if (email) {
        user = await User.findOne({ email });
    } else if (phoneNumber) {
        user = await User.findOne({ phoneNumber });
    }

    // Log user found
    console.log('User found:', user);

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otpCode = generateOTP();
   

    // Save OTP to the database
    await OTP.create({ userId: user._id, otp: otpCode });

    // Send OTP via Email or SMS
    if (email) {
        await sendEmail(email, "Your OTP Code", `Your OTP is ${otpCode}`);
    } else if (phoneNumber) {
        await sendSMS(phoneNumber, `Your OTP is ${otpCode}`);
    }

    res.status(200).json({ success: true, message: "OTP sent successfully" });
};
export const verifyOTP = async (req, res) => {
    const { email, phoneNumber, otp } = req.body;

    // Step 1: Find the user
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    // Step 2: Find the OTP in the database
    const validOTP = await OTP.findOne({ userId: user._id, otp });

    if (!validOTP) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Step 3: Verify the OTP expiration (if applicable)
    const otpAge = Date.now() - validOTP.createdAt;
    const otpExpiryTime = 10 * 60 * 1000; // 10 minutes
    if (otpAge > otpExpiryTime) {
        return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    // Step 4: Mark the user as verified
    user.isVerified = true;
    await user.save();

    // Step 5: Delete OTP after successful verification
    await OTP.deleteOne({ _id: validOTP._id });

    // Step 6: Respond with success
    res.status(200).json({ success: true, message: "OTP verified successfully" });
};
