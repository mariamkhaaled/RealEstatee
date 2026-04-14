const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");


// CHANGE PASSWORD (PROTECTED)
router.post("/change-password", verifyToken, userController.changePassword);

module.exports = router;