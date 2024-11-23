import express from "express";
import admin from "../config/firebaseAdmin.js";

const router = express.Router();

// Route to send OTP
router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required." });
    }

    // Generate a sessionInfo for the phone number (Firebase Auth API)
    const sessionInfo = await admin
      .auth()
      .createSessionCookie(phoneNumber, { expiresIn: 3600 * 1000 }); // Session expires in 1 hour

    res.status(200).json({
      message: "OTP sent successfully!",
      sessionInfo,
    });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

// Route to verify OTP
router.post("/verify-otp", async (req, res) => {
  const { sessionInfo, otp } = req.body;

  try {
    if (!sessionInfo || !otp) {
      return res
        .status(400)
        .json({ message: "SessionInfo and OTP are required." });
    }

    // Firebase requires sessionInfo to verify the OTP
    const verifiedPhone = await admin
      .auth()
      .verifyPhoneNumber(sessionInfo, otp);

    if (verifiedPhone) {
      res.status(200).json({
        message: "Phone number verified successfully!",
      });
    } else {
      res.status(400).json({
        message: "Invalid OTP or sessionInfo",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
});

export default router;
