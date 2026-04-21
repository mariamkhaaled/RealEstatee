const db = require('../config/db'); // Adjust if your db connection is located elsewhere

const getPendingListings = async (req, res) => {
  try {
    const query = `
      SELECT 
        l.listing_id,
        p.property_id,
        p.title,
        p.property_type,
        u.full_name AS owner_name,
        u.email AS owner_email,
        loc.city,
        l.purpose,
        l.price,
        l.status,
        l.created_at,
        (SELECT image_url FROM property_images pi WHERE pi.property_id = p.property_id LIMIT 1) AS image_url
      FROM listings l
      JOIN properties p ON l.property_id = p.property_id
      JOIN users u ON p.owner_id = u.user_id
      LEFT JOIN property_locations loc ON p.property_id = loc.property_id
      WHERE l.status = 'Pending'
      ORDER BY l.created_at DESC
    `;

    const [pendingListings] = await db.query(query);

    res.status(200).json({
      status: 'success',
      data: {
        properties: pendingListings
      }
    });
  } catch (error) {
    console.error("Error fetching pending listings:", error);
    res.status(500).json({ message: 'Server error retrieving pending approvals' });
  }
};

module.exports = {
  getPendingListings
};
