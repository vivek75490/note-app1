import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

// Send OTP (Signup route)
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.name && existingUser.dob) {
      return res.status(200).json({
        success: false,
        alreadyRegistered: true,
        message: "Email already registered",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.findOneAndUpdate(
      { email },
      { email, otp },
      { upsert: true, new: true }
    );

    console.log(`OTP for ${email}: ${otp}`);
    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Server error while sending OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { name, email, dob, otp } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.name = name;
    user.dob = dob;
    user.otp = "";
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Server error during verification" });
  }
});

export default router;
