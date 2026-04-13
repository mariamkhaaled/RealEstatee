const db = require('../config/db');

class Feature {
    static async findAll() {
        const [rows] = await db.execute(`
            SELECT feature_id, feature_name
            FROM features
            ORDER BY feature_name ASC
        `);

        return rows;
    }
}

module.exports = Feature;