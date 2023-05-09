const express = require("express");
const router = express.Router();

router.route("/")
  .post()
  .get();

router.route("/:ownRecipesId")
  .delete();

module.exports = router;

// TODO - patch для оновлення рецепту
