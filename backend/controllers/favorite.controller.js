const Favorite = require("../models/favorite.model");

// GET
exports.getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const favorites = await Favorite.getFavoritesByUser(userId);
    return res.json({ favorites });
  } catch (error) {
    console.error("Favorite fetch error:", error);
    return res.status(500).json({
      message: "Failed to load favorites",
      error: error?.message || error,
    });
  }
};

// ADD
exports.addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { property_id } = req.body;

  try {
    await Favorite.addFavorite(userId, property_id);
    return res.json({ message: "Added to favorites" });
  } catch (error) {
    console.error("Favorite add error:", error);
    return res.status(500).json({
      message: "Failed to add favorite",
      error: error?.message || error,
    });
  }
};

// DELETE
exports.deleteFavorite = async (req, res) => {
  const userId = req.user.id;
  const propertyId = req.params.property_id;

  try {
    await Favorite.deleteFavorite(userId, propertyId);
    return res.json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Favorite delete error:", error);
    return res.status(500).json({
      message: "Failed to remove favorite",
      error: error?.message || error,
    });
  }
};