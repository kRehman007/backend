const express = require("express");
const router = express.Router();
const {
  userSignUp,
  userLogIn,
  userLogOut,
} = require("../controllers/userController");

router.post("/signup", userSignUp);
router.post("/login", userLogIn);

router.post("/logout", userLogOut);

module.exports = router;
