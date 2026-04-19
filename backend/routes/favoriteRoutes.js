const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");

const favoriteController = require("../controllers/favorite.controller");

router.get("/", verifyToken, favoriteController.getFavorites);

router.post("/", verifyToken, favoriteController.addFavorite);

router.delete("/:property_id", verifyToken, favoriteController.deleteFavorite);

module.exports = router;