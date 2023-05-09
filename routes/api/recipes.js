const express = require("express");
const router = express.Router();

router.route("/categories/preview").get(); // - отпримання рецептів для MainPage
router.route("/categories").get(); // - отримання списку КАТЕГОРІЙ
router.route("/categories/:category").get(); // - отпримання рецептів по категорії (по 8 шт)
router.route("/:recipeId").get(); // пошук рецепту по ІД
router.route("/search").get(); // - пошук рецепту по ключовому слову

module.exports = router;