const express = require("express");
const router = express.Router();

router.route("/categories/preview").get();
router.route("/categories").get();
router.route("/categories/:category").get();
router.route("/:recipeId").get();
router.route("/search").get();

module.exports = router;