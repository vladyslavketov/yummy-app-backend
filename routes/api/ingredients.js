const express = require("express");
const auth = require("../../middlewares/auth");
const { addIngredientsToShoppingList, getIngredientsShoppingList } = require("../../controllers/ingredients");

const router = express.Router();

router.route("/shoppingList").get(auth, getIngredientsShoppingList);
router.route("/shoppingList/:ingredientId")
  .put(auth, addIngredientsToShoppingList)
  .delete(auth);

router.route("/").get();
router.route("/search").get();

module.exports = router;