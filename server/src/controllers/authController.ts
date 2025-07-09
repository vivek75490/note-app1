// src/controllers/authController.ts
import { Request, Response } from "express";

const otpStorage: Record<string, string> = {}; // temp memory store

export const sendOtp = (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStorage[email] = otp;

  console.log(`OTP for ${email}: ${otp}`); // simulate email sending

  return res.status(200).json({ success: true, message: "OTP sent" });
};

export const verifyOtp = (req: Request, res: Response) => {
  const { email, otp, name, dob } = req.body;

  if (!otp || otpStorage[email] !== otp) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  // optional: save user in DB here

  delete otpStorage[email]; // clear OTP after use

  return res.status(200).json({ success: true, message: "OTP verified" });
};
