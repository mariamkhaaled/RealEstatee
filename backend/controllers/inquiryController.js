const Inquiry = require("../models/inquiry.model");
const { sendInquiryNotification } = require("../services/emailService");

exports.createInquiry = async (req, res, next) => {
  try {
    const { listing_id, name, email, phone, message } = req.body;
    const customer_id = req.user?.user_id || req.user?.id || null;

    if (!customer_id) {
      return res.status(401).json({
        status: "fail",
        message: "Authentication required",
      });
    }

    if (!listing_id || Number.isNaN(Number(listing_id))) {
      return res.status(400).json({
        status: "fail",
        message: "Valid listing_id is required",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "Email is required",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "Phone is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "Message is required",
      });
    }

    const listingRows = await Inquiry.getListingForInquiry(Number(listing_id));
    const listing = listingRows[0];

    if (!listing) {
      return res.status(404).json({
        status: "fail",
        message: "Listing not found",
      });
    }

    if (listing.listing_status !== "Active") {
      return res.status(400).json({
        status: "fail",
        message: "This listing is not accepting new inquiries",
      });
    }

    if (Number(listing.owner_id) === Number(customer_id)) {
      return res.status(400).json({
        status: "fail",
        message: "Owner cannot create inquiry on own listing",
      });
    }

    const existingInquiryRows =
      await Inquiry.getActiveInquiryByListingAndCustomer(
        Number(listing_id),
        Number(customer_id),
      );

    if (existingInquiryRows.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "Inquiry already exists for this listing",
        data: {
          inquiry_id: existingInquiryRows[0].inquiry_id,
          reused: true,
        },
      });
    }

    const [result] = await Inquiry.createInquiry({
      listing_id: Number(listing_id),
      customer_id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      status: "Pending",
    });

    const inquiryRows = await Inquiry.getInquiryById(result.insertId);
    const inquiry = inquiryRows[0];

    if (inquiry?.owner_email) {
      await sendInquiryNotification({
        to: inquiry.owner_email,
        ownerName: inquiry.owner_name,
        propertyTitle: inquiry.property_title,
        requesterName: inquiry.name,
        requesterEmail: inquiry.email,
        requesterPhone: inquiry.phone,
        message: inquiry.message,
        viewRequestUrl: `${process.env.FRONTEND_URL || "http://localhost:5173"}/owner-dashboard?inquiryId=${inquiry.inquiry_id}`,
      });
    }

    const io = req.app.get("io");
    if (io && inquiry?.owner_id) {
      io.to(`inquiry_${inquiry.inquiry_id}`).emit("new_inquiry", {
        inquiry_id: inquiry.inquiry_id,
        listing_id: inquiry.listing_id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
        status: inquiry.status,
        property_title: inquiry.property_title,
        created_at: inquiry.created_at,
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Inquiry created successfully",
      data: {
        inquiry_id: result.insertId,
        reused: false,
      },
    });
  } catch (error) {
    if (error?.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid listing_id: listing does not exist",
      });
    }

    next(error);
  }
};

exports.getInquiries = async (req, res, next) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.user_id || req.user?.id;

    const inquiries =
      userRole === "admin"
        ? await Inquiry.getAllInquiries()
        : await Inquiry.getInquiriesForOwner(userId || 0);

    res.status(200).json({
      status: "success",
      data: inquiries,
    });
  } catch (error) {
    next(error);
  }
};
