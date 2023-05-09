const express = require("express");
const { register } = require("../../controllers/users");

const router = express.Router();

router.route("/register").post(register);
// router.route("/login").post(login);
// router.route("/current").get(auth, getCurrent);
// router.route("/logout").post(auth, logout);
// router.route("/subscribe").post(auth, subscribe);

module.exports = router;