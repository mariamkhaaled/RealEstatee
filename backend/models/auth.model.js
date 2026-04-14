const db = require("../config/db");

// CREATE USER
exports.createUser = async (user) => {
  const sql = `
    INSERT INTO users (full_name, email, password_hash, phone, role, is_verified, otp_code, token_expires)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  return db.execute(sql, [
    user.full_name,
    user.email,
    user.password_hash,
    user.phone,
    user.role,
    user.is_verified,
    user.otp_code,
    user.token_expires,
  ]);
};
// UPDATE VERIFICATION STATUS
exports.updateVerificationStatus = async (userId, status) => {
  const sql = `
    UPDATE users 
    SET is_verified = ?, otp_code = NULL, token_expires = NULL 
    WHERE user_id = ?
  `;
  return db.execute(sql, [status, userId]);
};
// FIND BY EMAIL
exports.findByEmail = async (email) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  const [rows] = await db.execute(sql, [email]);
  return rows;
};

// FIND BY ID
exports.findById = async (id) => {
  const sql = `SELECT * FROM users WHERE user_id = ?`;
  const [rows] = await db.execute(sql, [id]);
  return rows;
};

// UPDATE PASSWORD
exports.updatePassword = async (userId, newPasswordHash) => {
  const sql = `
    UPDATE users 
    SET password_hash = ? 
    WHERE user_id = ?
  `;
  return db.execute(sql, [newPasswordHash, userId]);
};
