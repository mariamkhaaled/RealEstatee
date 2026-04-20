const db = require("../config/db");

exports.createInquiry = async (inquiry) => {
  const sql = `
    INSERT INTO inquiries (listing_id, customer_id, name, email, phone, message, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  return db.execute(sql, [
    inquiry.listing_id,
    inquiry.customer_id || null,
    inquiry.name,
    inquiry.email,
    inquiry.phone,
    inquiry.message,
    inquiry.status || "Pending",
  ]);
};

exports.getInquiriesForOwner = async (ownerId) => {
  const sql = `
    SELECT
      i.inquiry_id,
      i.listing_id,
      i.customer_id,
      i.name,
      i.email,
      i.phone,
      i.message,
      i.status,
      i.created_at,
      p.title AS property_title,
      p.owner_id,
      l.price,
      l.status AS listing_status,
      l.purpose,
      m.content AS last_message_content,
      m.created_at AS last_message_date,
      u_sender.full_name AS last_message_sender_name
    FROM inquiries i
    INNER JOIN listings l ON l.listing_id = i.listing_id
    INNER JOIN properties p ON p.property_id = l.property_id
    LEFT JOIN messages m ON m.inquiry_id = i.inquiry_id 
      AND m.message_id = (
        SELECT message_id FROM messages 
        WHERE inquiry_id = i.inquiry_id 
        ORDER BY created_at DESC 
        LIMIT 1
      )
    LEFT JOIN users u_sender ON u_sender.user_id = m.sender_id
    WHERE p.owner_id = ?
    ORDER BY COALESCE(m.created_at, i.created_at) DESC
  `;

  const [rows] = await db.execute(sql, [ownerId]);
  return rows;
};

exports.getInquiriesForCustomer = async (customerId) => {
  const sql = `
    SELECT
      i.inquiry_id,
      i.listing_id,
      i.customer_id,
      i.name,
      i.email,
      i.phone,
      i.message,
      i.status,
      i.created_at,
      p.title AS property_title,
      p.owner_id,
      u.full_name AS owner_name,
      u.email AS owner_email,
      l.price,
      l.status AS listing_status,
      l.purpose,
      m.content AS last_message_content,
      m.created_at AS last_message_date,
      u_sender.full_name AS last_message_sender_name
    FROM inquiries i
    INNER JOIN listings l ON l.listing_id = i.listing_id
    INNER JOIN properties p ON p.property_id = l.property_id
    INNER JOIN users u ON u.user_id = p.owner_id
    LEFT JOIN messages m ON m.inquiry_id = i.inquiry_id 
      AND m.message_id = (
        SELECT message_id FROM messages 
        WHERE inquiry_id = i.inquiry_id 
        ORDER BY created_at DESC 
        LIMIT 1
      )
    LEFT JOIN users u_sender ON u_sender.user_id = m.sender_id
    WHERE i.customer_id = ?
    ORDER BY COALESCE(m.created_at, i.created_at) DESC
  `;

  const [rows] = await db.execute(sql, [customerId]);
  return rows;
};

exports.getAllInquiries = async () => {
  const sql = `
    SELECT
      i.inquiry_id,
      i.listing_id,
      i.customer_id,
      i.name,
      i.email,
      i.phone,
      i.message,
      i.status,
      i.created_at,
      p.title AS property_title,
      p.owner_id,
      l.price,
      l.status AS listing_status,
      l.purpose
    FROM inquiries i
    INNER JOIN listings l ON l.listing_id = i.listing_id
    INNER JOIN properties p ON p.property_id = l.property_id
    ORDER BY i.created_at DESC
  `;

  const [rows] = await db.execute(sql);
  return rows;
};

exports.getInquiryById = async (inquiryId) => {
  const sql = `
    SELECT
      i.inquiry_id,
      i.listing_id,
      i.customer_id,
      i.name,
      i.email,
      i.phone,
      i.message,
      i.status,
      i.created_at,
      p.title AS property_title,
      p.owner_id,
      u.full_name AS owner_name,
      u.email AS owner_email,
      l.price,
      l.status AS listing_status,
      l.purpose
    FROM inquiries i
    INNER JOIN listings l ON l.listing_id = i.listing_id
    INNER JOIN properties p ON p.property_id = l.property_id
    INNER JOIN users u ON u.user_id = p.owner_id
    WHERE i.inquiry_id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [inquiryId]);
  return rows;
};

exports.getListingForInquiry = async (listingId) => {
  const sql = `
    SELECT
      l.listing_id,
      l.status AS listing_status,
      p.property_id,
      p.title AS property_title,
      p.owner_id,
      u.full_name AS owner_name,
      u.email AS owner_email
    FROM listings l
    INNER JOIN properties p ON p.property_id = l.property_id
    INNER JOIN users u ON u.user_id = p.owner_id
    WHERE l.listing_id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [listingId]);
  return rows;
};

exports.getActiveInquiryByListingAndCustomer = async (
  listingId,
  customerId,
) => {
  const sql = `
    SELECT
      inquiry_id,
      status
    FROM inquiries
    WHERE listing_id = ?
      AND customer_id = ?
      AND status IN ('Pending', 'Reviewed')
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [listingId, customerId]);
  return rows;
};

exports.getInquiryParticipants = async (inquiryId) => {
  const sql = `
    SELECT
      i.inquiry_id,
      i.customer_id,
      p.owner_id
    FROM inquiries i
    INNER JOIN listings l ON l.listing_id = i.listing_id
    INNER JOIN properties p ON p.property_id = l.property_id
    WHERE i.inquiry_id = ?
    LIMIT 1
  `;

  const [rows] = await db.execute(sql, [inquiryId]);
  return rows;
};

exports.updateInquiryStatus = async (inquiryId, status) => {
  const sql = `
    UPDATE inquiries
    SET status = ?
    WHERE inquiry_id = ?
  `;

  return db.execute(sql, [status, inquiryId]);
};
