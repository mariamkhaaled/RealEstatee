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
            pl.address,

            pi.image_url,
            f.feature_name

        FROM properties p
        JOIN listings l ON p.property_id = l.property_id
        LEFT JOIN property_locations pl ON p.property_id = pl.property_id
        LEFT JOIN property_images pi ON p.property_id = pi.property_id
        LEFT JOIN property_features pf ON p.property_id = pf.property_id
        LEFT JOIN features f ON pf.feature_id = f.feature_id
        ORDER BY p.property_id DESC
    `);

    const propertiesMap = {};

    for (const row of rows) {
        if (!propertiesMap[row.property_id]) {
            propertiesMap[row.property_id] = {
                property_id: row.property_id,
                title: row.title,
                description: row.description,
                property_type: row.property_type,
                bedrooms: row.bedrooms,
                bathrooms: row.bathrooms,
                area: row.area,
                listing_id: row.listing_id,
                purpose: row.purpose,
                price: row.price,
                status: row.status,
                views: row.views,
                city: row.city,
                address: row.address,
                images: [],
                features: []
            };
        }

        // images
        if (row.image_url && !propertiesMap[row.property_id].images.includes(row.image_url)) {
            propertiesMap[row.property_id].images.push(row.image_url);
        }

        // features
        if (row.feature_name && !propertiesMap[row.property_id].features.includes(row.feature_name)) {
            propertiesMap[row.property_id].features.push(row.feature_name);
        }
    }

    return Object.values(propertiesMap);
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

    static async findByOwnerId(ownerId) {
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
            pl.address,
            pi.image_url,
            f.feature_name
        FROM properties p
        JOIN listings l ON p.property_id = l.property_id
        LEFT JOIN property_locations pl ON p.property_id = pl.property_id
        LEFT JOIN property_images pi ON p.property_id = pi.property_id
        LEFT JOIN property_features pf ON p.property_id = pf.property_id
        LEFT JOIN features f ON pf.feature_id = f.feature_id
        WHERE p.owner_id = ?
        ORDER BY p.property_id DESC
    `, [ownerId]);

    const propertiesMap = {};

    for (const row of rows) {
        if (!propertiesMap[row.property_id]) {
            propertiesMap[row.property_id] = {
                property_id: row.property_id,
                title: row.title,
                description: row.description,
                property_type: row.property_type,
                bedrooms: row.bedrooms,
                bathrooms: row.bathrooms,
                area: row.area,
                listing_id: row.listing_id,
                purpose: row.purpose,
                price: row.price,
                status: row.status,
                views: row.views,
                city: row.city,
                address: row.address,
                images: [],
                features: []
            };
        }

        if (row.image_url && !propertiesMap[row.property_id].images.includes(row.image_url)) {
            propertiesMap[row.property_id].images.push(row.image_url);
        }

        if (row.feature_name && !propertiesMap[row.property_id].features.includes(row.feature_name)) {
            propertiesMap[row.property_id].features.push(row.feature_name);
        }
    }

    return Object.values(propertiesMap);
}
static async findById(propertyId) {
        const [rows] = await db.execute(`
            SELECT 
                p.property_id,
                p.owner_id,
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
                pl.address,
                pi.image_url,
                f.feature_name
            FROM properties p
            JOIN listings l ON p.property_id = l.property_id
            LEFT JOIN property_locations pl ON p.property_id = pl.property_id
            LEFT JOIN property_images pi ON p.property_id = pi.property_id
            LEFT JOIN property_features pf ON p.property_id = pf.property_id
            LEFT JOIN features f ON pf.feature_id = f.feature_id
            WHERE p.property_id = ?
        `, [propertyId]);

        if (!rows.length) return null;

        const property = {
            property_id: rows[0].property_id,
            owner_id: rows[0].owner_id,
            title: rows[0].title,
            description: rows[0].description,
            property_type: rows[0].property_type,
            bedrooms: rows[0].bedrooms,
            bathrooms: rows[0].bathrooms,
            area: rows[0].area,
            listing_id: rows[0].listing_id,
            purpose: rows[0].purpose,
            price: rows[0].price,
            status: rows[0].status,
            views: rows[0].views,
            city: rows[0].city,
            address: rows[0].address,
            images: [],
            features: []
        };

        for (const row of rows) {
            if (row.image_url && !property.images.includes(row.image_url)) {
                property.images.push(row.image_url);
            }

            if (row.feature_name && !property.features.includes(row.feature_name)) {
                property.features.push(row.feature_name);
            }
        }

        return property;
    }
}



module.exports = Property;