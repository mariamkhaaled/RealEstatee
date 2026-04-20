const Message = require("../models/message.model");
const Inquiry = require("../models/inquiry.model");

// SEND MESSAGE
exports.sendMessage = async (req, res, next) => {
  try {
    const { inquiry_id, receiver_id, content } = req.body;
    const sender_id = req.user.user_id || req.user.id;
    const senderRole = req.user.role;

    if (!inquiry_id || Number.isNaN(Number(inquiry_id))) {
      return res.status(400).json({
        status: "fail",
        message: "Valid inquiry_id is required",
      });
    }

    if (!receiver_id || Number.isNaN(Number(receiver_id))) {
      return res.status(400).json({
        status: "fail",
        message: "Valid receiver_id is required",
      });
    }

    if (!sender_id) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        status: "fail",
        message: "Content is required",
      });
    }

    const participantsRows = await Inquiry.getInquiryParticipants(
      Number(inquiry_id),
    );
    const participants = participantsRows[0];

    if (!participants) {
      return res.status(404).json({
        status: "fail",
        message: "Inquiry not found",
      });
    }

    const ownerId = Number(participants.owner_id);
    const customerId = participants.customer_id
      ? Number(participants.customer_id)
      : null;
    const senderId = Number(sender_id);
    const receiverId = Number(receiver_id);
    const isAdmin = senderRole === "admin";
    const isParticipant = senderId === ownerId || senderId === customerId;

    if (!isAdmin && !isParticipant) {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to send messages in this inquiry",
      });
    }

    if (!isAdmin) {
      const validReceiverIds = [ownerId, customerId].filter((id) =>
        Number.isFinite(id),
      );
      const isValidReceiver =
        validReceiverIds.includes(receiverId) && receiverId !== senderId;

      if (!isValidReceiver) {
        return res.status(400).json({
          status: "fail",
          message: "receiver_id must be the other inquiry participant",
        });
      }
    }

    const [result] = await Message.createMessage({
      inquiry_id: Number(inquiry_id),
      sender_id: senderId,
      receiver_id: receiverId,
      content: content.trim(),
    });

    const io = req.app.get("io");

    if (io) {
      io.to(`inquiry_${Number(inquiry_id)}`).emit("new_message", {
        message_id: result.insertId,
        inquiry_id: Number(inquiry_id),
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim(),
        is_read: 0,
        created_at: new Date(),
      });
    }

    res.status(201).json({
      status: "success",
      message: "Message sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET MESSAGES BY INQUIRY ID
exports.getInquiryMessages = async (req, res, next) => {
  try {
    const { inquiryId } = req.params;
    const userId = req.user?.user_id || req.user?.id;
    const userRole = req.user?.role;

    if (!inquiryId || Number.isNaN(Number(inquiryId))) {
      return res.status(400).json({
        status: "fail",
        message: "Valid inquiryId is required",
      });
    }

    const participantsRows = await Inquiry.getInquiryParticipants(
      Number(inquiryId),
    );
    const participants = participantsRows[0];

    if (!participants) {
      return res.status(404).json({
        status: "fail",
        message: "Inquiry not found",
      });
    }

    const normalizedUserId = Number(userId);
    const ownerId = Number(participants.owner_id);
    const customerId = participants.customer_id
      ? Number(participants.customer_id)
      : null;

    if (
      userRole !== "admin" &&
      normalizedUserId !== ownerId &&
      normalizedUserId !== customerId
    ) {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to view messages for this inquiry",
      });
    }

    const messages = await Message.getMessagesByInquiry(inquiryId);

    res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

exports.markInquiryAsRead = async (req, res, next) => {
  try {
    const inquiryId = Number(req.params.inquiryId);
    const userId = Number(req.user?.user_id || req.user?.id || 0);
    const userRole = req.user?.role;

    if (!inquiryId || Number.isNaN(inquiryId)) {
      return res.status(400).json({
        status: "fail",
        message: "Valid inquiryId is required",
      });
    }

    const participantsRows = await Inquiry.getInquiryParticipants(inquiryId);
    const participants = participantsRows[0];

    if (!participants) {
      return res.status(404).json({
        status: "fail",
        message: "Inquiry not found",
      });
    }

    const ownerId = Number(participants.owner_id);
    const customerId = participants.customer_id
      ? Number(participants.customer_id)
      : null;

    if (userRole !== "admin" && userId !== ownerId && userId !== customerId) {
      return res.status(403).json({
        status: "fail",
        message: "You are not allowed to update messages for this inquiry",
      });
    }

    await Message.markInquiryMessagesAsRead(inquiryId, userId);

    res.status(200).json({
      status: "success",
      message: "Messages marked as read",
      data: {
        inquiry_id: inquiryId,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getUnreadCounts = async (req, res, next) => {
  try {
    const userId = Number(req.user?.user_id || req.user?.id || 0);

    if (!userId) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

    const rows = await Message.getUnreadCountsByInquiryForUser(userId);

    res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};
