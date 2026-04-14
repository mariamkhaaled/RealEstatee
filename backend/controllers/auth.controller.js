const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");
const { sendOTP } = require("../services/emailService");


// =======================
// SIGNUP
// =======================
exports.signup = async (req, res, next) => {
  try {
    const { full_name, email, password, phone, role } = req.body;

    const existing = await User.findByEmail(email);

    if (existing.length > 0) {
      return res.status(400).json({
        status: "fail",
        message: "Email already exists",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);


    const hashed = await bcrypt.hash(password, 10);

    const result = await User.createUser({
      full_name,
      email: email.toLowerCase().trim(),
      password_hash: hashed,
      phone,
      role: role || "owner",
      is_verified: 0,
      otp_code: otp,         
      token_expires: otpExpires
    });

    await sendOTP(email.toLowerCase().trim(), otp);

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        id: result.insertId || result.id,
        full_name,
        email,
        phone,
        role: role || "owner",
      },
    });
  } catch (err) {
    next(err);
  }
};


// =======================
// LOGIN
// =======================
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const users = await User.findByEmail(email.toLowerCase().trim());

    if (users.length === 0) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    if (user.is_verified === 0) {
      return res.status(403).json({ 
        status: "fail", 
        message: "Please verify your email before logging in." 
      });
    }
    
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    // 🔥 JWT TOKEN
    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Split full_name into firstName and lastName
    const nameParts = user.full_name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,

      // 🔥 IMPORTANT: frontend عندك مستني data.data
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
// GET PROFILE
// =======================
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const users = await User.findById(userId);

    if (!users || users.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const user = users[0];

    // Split full_name into firstName and lastName
    const nameParts = user.full_name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    res.status(200).json({
      status: "success",
      message: "Profile retrieved successfully",
      data: {
        id: user.user_id,
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};