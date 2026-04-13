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
                images = [],
                feature_ids = [],
                owner_id
            } = data;

            const [propertyResult] = await connection.execute(`
                INSERT INTO properties
                (owner_id, title, description, property_type, bedrooms, bathrooms, area)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                owner_id,
                property.title,
                property.description,
                property.type,
                property.bedrooms || 0,
                property.bathrooms || 0,
                property.area || 0
            ]);

            const propertyId = propertyResult.insertId;

            await connection.execute(`
                INSERT INTO property_locations
                (property_id, city, address)
                VALUES (?, ?, ?)
            `, [
                propertyId,
                location.city,
                location.address || null
            ]);

            await connection.execute(`
                INSERT INTO listings
                (property_id, purpose, price, status, views)
                VALUES (?, ?, ?, ?, ?)
            `, [
                propertyId,
                listing.purpose,
                listing.price,
                listing.status || 'Active',
                listing.views || 0
            ]);

            if (Array.isArray(images) && images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    await connection.execute(`
                        INSERT INTO property_images (property_id, image_url, is_primary)
                        VALUES (?, ?, ?)
                    `, [propertyId, images[i], i === 0]);
                }
            }

            if (Array.isArray(feature_ids) && feature_ids.length > 0) {
                for (const featureId of feature_ids) {
                    await connection.execute(`
                        INSERT INTO property_features (property_id, feature_id)
                        VALUES (?, ?)
                    `, [propertyId, featureId]);
                }
            }

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