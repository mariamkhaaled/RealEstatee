const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload"); // ✅ FIX ADD THIS

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/profile", verifyToken, authController.getProfile);

// ✅ FIXED ROUTE
router.put(
  "/photo",
  verifyToken,
  upload.single("photo"),
  authController.updatePhoto
);

module.exports = router;