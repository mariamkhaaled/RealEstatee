
const bcrypt = require("bcryptjs");
const User = require("../models/auth.model");

// =======================
// CHANGE PASSWORD
// =======================
exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "New password must be at least 6 characters",
      });
    }

    // Find user
    const users = await User.findById(userId);
    if (!users || users.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const user = users[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await User.updatePassword(userId, hashedPassword);

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};