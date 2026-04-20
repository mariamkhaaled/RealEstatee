const db = require("../config/db");

const getFavoritesByUser = async (userId) => {
  const [rows] = await db.execute(
    `
      SELECT 
        p.property_id,
        p.title,
        p.description,
        p.property_type,
        p.bedrooms,
        p.bathrooms,
        p.area,
        l.price,
        l.status,
        l.purpose,
        l.created_at,
        pl.city,
        pl.address,
        pi.image_url,
        f.feature_name,
        p.owner_id
      FROM favorites fv
      JOIN properties p ON fv.property_id = p.property_id
      JOIN listings l ON p.property_id = l.property_id
      LEFT JOIN property_locations pl ON p.property_id = pl.property_id
      LEFT JOIN property_images pi ON p.property_id = pi.property_id
      LEFT JOIN property_features pf ON p.property_id = pf.property_id
      LEFT JOIN features f ON pf.feature_id = f.feature_id
      WHERE fv.customer_id = ?
      ORDER BY p.property_id DESC
    `,
    [userId]
  );

  const favoritesMap = {};

  for (const row of rows) {
    if (!favoritesMap[row.property_id]) {
      favoritesMap[row.property_id] = {
        id: String(row.property_id),
        title: row.title,
        description: row.description,
        type: row.property_type,
        beds: row.bedrooms,
        baths: row.bathrooms,
        sqft: row.area,
        price: row.price,
        status: row.status,
        purpose: row.purpose,
        createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
        location: [row.city, row.address].filter(Boolean).join(", "),
        images: [],
        features: [],
        ownerId: row.owner_id ? String(row.owner_id) : null,
      };
    }

    if (row.image_url && !favoritesMap[row.property_id].images.includes(row.image_url)) {
      favoritesMap[row.property_id].images.push(row.image_url);
    }

    if (row.feature_name && !favoritesMap[row.property_id].features.includes(row.feature_name)) {
      favoritesMap[row.property_id].features.push(row.feature_name);
    }
  }

  return Object.values(favoritesMap);
};

// ADD favorite
const addFavorite = async (userId, propertyId) => {
  const sql = `
    INSERT INTO favorites (customer_id, property_id)
    VALUES (?, ?)
  `;

  await db.execute(sql, [userId, propertyId]);
};

// DELETE favorite
const deleteFavorite = async (userId, propertyId) => {
  const sql = `
    DELETE FROM favorites
    WHERE customer_id = ? AND property_id = ?
  `;

  await db.execute(sql, [userId, propertyId]);
};

module.exports = {
  getFavoritesByUser,
  addFavorite,
  deleteFavorite,
};