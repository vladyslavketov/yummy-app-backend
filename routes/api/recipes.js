const express = require("express");
const { getCategoriesPreview, getRecipesByCategory, getCategoriesList, getRecipeById, getRecipesBySearchTitle } = require("../../controllers/recipes");

const router = express.Router();

router.route("/preview").get(getCategoriesPreview); // - отпримання рецептів для MainPage
router.route("/categories").get(getCategoriesList); // - отримання списку КАТЕГОРІЙ
router.route("/categories/:category").get(getRecipesByCategory); // - отпримання рецептів по категорії (по 8 шт)
router.route("/:recipeId").get(getRecipeById); // пошук рецепту по ІД
router.route("/search").get(getRecipesBySearchTitle); // - пошук рецепту по ключовому слову

module.exports = router;