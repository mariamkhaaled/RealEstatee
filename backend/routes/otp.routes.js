const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otp.controller");

// Verify OTP: /api/otp/verify
router.post("/verify", otpController.verifyOTP);

// Resend OTP: /api/otp/resend
router.post("/resend", otpController.resendOTP);

// Forgot Password: /api/otp/forgot-password
router.post("/forgot-password", otpController.forgotPassword);

// Reset Password: /api/otp/reset-password
router.post("/reset-password", otpController.resetPassword);

module.exports = router;
