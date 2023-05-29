const express = require("express");
const { getCategoriesPreview, getRecipesByCategory, getCategoriesList, getRecipeById, getRecipesBySearchTitle, getFavorite, addToFavorite, deleteFromFavorite } = require("../../controllers/recipes");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/preview").get(getCategoriesPreview); // - отпримання рецептів для MainPage
router.route("/search").get(getRecipesBySearchTitle); // - пошук рецепту по ключовому слову

router.route("/categories").get(getCategoriesList); // - отримання списку КАТЕГОРІЙ
router.route("/categories/:category").get(getRecipesByCategory); // - отпримання рецептів по категорії (по 8 шт)

router.route("/favorites").get(auth, getFavorite);
router.route("/favorites/:recipeId")
  .put(auth, addToFavorite)
  .patch(auth, deleteFromFavorite);

router.route("/:recipeId").get(auth, getRecipeById); // пошук рецепту по ІД

module.exports = router;