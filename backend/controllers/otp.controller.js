const User = require("../models/auth.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../services/emailService");
const db = require("../config/db");

// =======================
// VERIFY OTP
// =======================
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const users = await User.findByEmail(email.toLowerCase().trim());
    if (users.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const user = users[0];

    // Check OTP code and expiry
    const isOtpValid = user.otp_code === otp;
    const isNotExpired = new Date() < new Date(user.token_expires);

    if (!isOtpValid) {
      return res.status(400).json({ status: "fail", message: "Invalid code" });
    }

    if (!isNotExpired) {
      return res.status(400).json({ status: "fail", message: "Code expired" });
    }

    // Mark user as verified in database
    await User.updateVerificationStatus(user.user_id, 1);

    // Generate JWT token for auto-login
    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Split full_name into firstName and lastName
    const nameParts = user.full_name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    res.status(200).json({
      status: "success",
      message: "Email verified! You can login now.",
      token,
      data: {
        id: user.user_id,
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// RESEND OTP
// =======================
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const users = await User.findByEmail(email.toLowerCase().trim());
    if (users.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const user = users[0];

    // Check if user is already verified
    if (user.is_verified === 1) {
      return res
        .status(400)
        .json({ status: "fail", message: "User already verified" });
    }

    // Generate new OTP code
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update OTP in database
    const sql = `
      UPDATE users 
      SET otp_code = ?, token_expires = ?
      WHERE user_id = ?
    `;
    await db.execute(sql, [newOtp, otpExpires, user.user_id]);

    // Send OTP email
    await sendOTP(email.toLowerCase().trim(), newOtp);

    res.status(200).json({
      status: "success",
      message: "OTP sent to your email. It expires in 10 minutes.",
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// FORGOT PASSWORD
// =======================
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const users = await User.findByEmail(email.toLowerCase().trim());
    if (users.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update OTP in database
    const sql = `
      UPDATE users 
      SET otp_code = ?, token_expires = ?
      WHERE email = ?
    `;
    await db.execute(sql, [otp, otpExpires, email.toLowerCase().trim()]);

    // Send OTP email
    await sendOTP(email.toLowerCase().trim(), otp);

    res.status(200).json({
      status: "success",
      message: "OTP sent to your email. It expires in 10 minutes.",
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// RESET PASSWORD
// =======================
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "Email, OTP, and password are required",
        });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "Password must be at least 6 characters",
        });
    }

    const users = await User.findByEmail(email.toLowerCase().trim());
    if (users.length === 0) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const user = users[0];

    // Verify OTP code and expiry
    const isOtpValid = user.otp_code === otp;
    const isNotExpired = new Date() < new Date(user.token_expires);

    if (!isOtpValid) {
      return res.status(400).json({ status: "fail", message: "Invalid code" });
    }

    if (!isNotExpired) {
      return res.status(400).json({ status: "fail", message: "Code expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP fields
    const updateSql = `
      UPDATE users 
      SET password_hash = ?, otp_code = NULL, token_expires = NULL
      WHERE user_id = ?
    `;
    await db.execute(updateSql, [hashedPassword, user.user_id]);

    res.status(200).json({
      status: "success",
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (err) {
    next(err);
  }
};
