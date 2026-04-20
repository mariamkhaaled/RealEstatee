const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");
const { verifyToken } = require("../middleware/auth.middleware");

// SEND MESSAGE (PROTECTED)
router.post("/", verifyToken, messageController.sendMessage);
router.get("/unread-counts", verifyToken, messageController.getUnreadCounts);
router.patch(
  "/:inquiryId/read",
  verifyToken,
  messageController.markInquiryAsRead,
);

// GET INQUIRY MESSAGES (PROTECTED)
router.get("/:inquiryId", verifyToken, messageController.getInquiryMessages);

module.exports = router;
