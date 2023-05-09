const express = require("express");
const router = express.Router();

router.route("/").get();
router.route("/search").get();

module.exports = router;