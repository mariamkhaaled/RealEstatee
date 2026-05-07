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


const getDashboardStats = async (req, res) => {
  try {
    // Get total users
    const [totalUsersRes] = await db.query('SELECT COUNT(*) as count FROM users');
    
    // Get active owners
    const [activeOwnersRes] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "owner"');

    // Get 5 most recently registered users
    const [recentUsers] = await db.query('SELECT full_name, role, created_at FROM users ORDER BY created_at DESC LIMIT 5');

    res.status(200).json({
      status: 'success',
      data: {
        // MUST wrap in Number() to prevent JSON crashes
        totalUsers: Number(totalUsersRes[0].count),
        activeOwners: Number(activeOwnersRes[0].count),
        recentUsers: recentUsers
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: 'Server error retrieving dashboard stats' });
  }
};

module.exports = {
  getPendingListings,
  getDashboardStats // 2. Don't forget to export the new function here!
};
