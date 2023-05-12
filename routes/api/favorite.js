const express = require("express");

const router = express.Router();

router.route("/").get();
router.route("/:recipeId")
  .put()
  .delete();

module.exports = router;