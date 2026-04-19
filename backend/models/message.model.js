const db = require("../config/db");

// CREATE MESSAGE
exports.createMessage = async (messageData) => {
  const { inquiry_id, sender_id, receiver_id, content } = messageData;

  const sql = `
    INSERT INTO messages (inquiry_id, sender_id, receiver_id, content)
    VALUES (?, ?, ?, ?)
  `;

  return db.execute(sql, [inquiry_id, sender_id, receiver_id, content]);
};

// GET MESSAGES BY INQUIRY
exports.getMessagesByInquiry = async (inquiryId) => {
  const sql = `
    SELECT
      m.message_id,
      m.inquiry_id,
      m.sender_id,
      m.receiver_id,
      m.content,
      m.is_read,
      m.created_at,
      u.full_name AS sender_name
    FROM messages m
    LEFT JOIN users u ON u.user_id = m.sender_id
    WHERE m.inquiry_id = ? 
    ORDER BY m.created_at ASC
  `;

  const [rows] = await db.execute(sql, [inquiryId]);
  return rows;
};
