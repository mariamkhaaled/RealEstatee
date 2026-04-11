const db = require('../config/db');

class Property {
  
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM properties');
        return rows;
    }

   
    static async create(data) {
        const { title, price, description } = data;
        const sql = `INSERT INTO properties (title, price, description) VALUES (?, ?, ?)`;
        const [result] = await db.execute(sql, [title, price, description]);
        return result.insertId;
    }
}

module.exports = Property;