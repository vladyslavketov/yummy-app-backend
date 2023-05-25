const express = require("express");
const auth = require("../../middlewares/auth");
const { getFavorite, addToFavorite, deleteFromFavorite } = require("../../controllers/favorite");

const router = express.Router();

router.route("/")
  .get(auth, getFavorite);
router.route("/:recipeId")
  .put(auth, addToFavorite)
  .patch(auth, deleteFromFavorite);

module.exports = router;