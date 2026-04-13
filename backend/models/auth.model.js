const db = require("../config/db");

// CREATE USER
exports.createUser = async (user) => {
  const sql = `
    INSERT INTO users (full_name, email, password_hash, phone, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  return db.execute(sql, [
    user.full_name,
    user.email,
    user.password_hash,
    user.phone,
    user.role,
  ]);
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