const db = require('../config/db');

class Property {
    static async findAll() {
        const [rows] = await db.execute(`
            SELECT 
                p.property_id,
                p.title,
                p.description,
                p.property_type,
                p.bedrooms,
                p.bathrooms,
                p.area,
                l.listing_id,
                l.purpose,
                l.price,
                l.status,
                l.views,
                pl.city,
                pl.address
            FROM properties p
            JOIN listings l ON p.property_id = l.property_id
            LEFT JOIN property_locations pl ON p.property_id = pl.property_id
            ORDER BY p.property_id DESC
        `);

        return rows;
    }

    static async create(data) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const {
                property,
                location,
                listing,
                owner_id = 1
            } = data;

            const propertySql = `
                INSERT INTO properties
                (owner_id, title, description, property_type, bedrooms, bathrooms, area)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const [propertyResult] = await connection.execute(propertySql, [
                owner_id,
                property.title,
                property.description,
                property.type,
                property.bedrooms || 0,
                property.bathrooms || 0,
                property.area || 0
            ]);

            const propertyId = propertyResult.insertId;

            const locationSql = `
                INSERT INTO property_locations
                (property_id, city, address)
                VALUES (?, ?, ?)
            `;

            await connection.execute(locationSql, [
                propertyId,
                location.city,
                location.address || null
            ]);

            const listingSql = `
                INSERT INTO listings
                (property_id, purpose, price, status, views)
                VALUES (?, ?, ?, ?, ?)
            `;

            await connection.execute(listingSql, [
                propertyId,
                listing.purpose,
                listing.price,
                listing.status || 'Active',
                listing.views || 0
            ]);

            await connection.commit();
            return propertyId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Property;