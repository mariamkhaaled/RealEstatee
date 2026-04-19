const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const { verifyToken } = require("../middleware/auth.middleware");

// SEND MESSAGE (PROTECTED)
router.post("/", verifyToken, messageController.sendMessage);

// GET INQUIRY MESSAGES (PROTECTED)
router.get("/:inquiryId", verifyToken, messageController.getInquiryMessages);

module.exports = router;
