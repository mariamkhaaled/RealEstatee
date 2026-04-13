const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// ======================
// AUTH ROUTES
// ======================

// SIGNUP
router.post("/signup", authController.signup);

// LOGIN
router.post("/login", authController.login);

// GET PROFILE (PROTECTED)
router.get("/profile", verifyToken, authController.getProfile);

// TEST PROTECTED ROUTE (for debugging)
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Token is valid",
    user: req.user,
  });
});

module.exports = router;