const express = require("express");
const router = express.Router();

const inquiryController = require("../controllers/inquiryController");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/", verifyToken, inquiryController.createInquiry);
router.patch(
  "/:inquiryId/status",
  verifyToken,
  inquiryController.updateInquiryStatus,
);
router.get("/mine", verifyToken, inquiryController.getMyInquiries);
router.get("/", verifyToken, inquiryController.getInquiries);

module.exports = router;
