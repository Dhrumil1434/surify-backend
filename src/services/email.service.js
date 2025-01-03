import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
    },
});

export const sendEmail = async (to, subject, text) => {
    try {
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h1 style="color: #4CAF50;">Welcome to Surify</h1>
                <p>Hi there,</p>
                <p>Thank you for registering with Surify. We're excited to have you on board! Your OTP is:</p>
                <h2 style="color: #4CAF50;">${text}</h2>
                <p style="margin-top: 20px; color: #555;">If you didn’t sign up for Surify, please ignore this email.</p>
            </div>
        `;

        const info = await transporter.sendMail({
            from: `"Surify" <${process.env.SMTP_USER}>`, // sender address
            to, // recipient
            subject: subject, // email subject
            text, // plain text body
            html: htmlContent, // HTML body
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw error;
    }
};
