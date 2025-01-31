const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync");
const userController = require("../controller/user");
const passport = require("passport");
const { isRegistered } = require("../middleware");

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    isRegistered,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  );

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router.route("/logout").get(userController.logout);

module.exports = router;
