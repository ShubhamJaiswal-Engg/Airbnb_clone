const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const wrapAsync = require("../untils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");

const userController = require("../controlers/user.js");

router.route("/signup")
.get(userController.renderSingupForm)
.post( wrapAsync(userController.singUp));

router.route("/login")
.get(userController.renderLoginForm)
.post( saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash:true,}),  userController.login);

router.get("/logout",userController.logout);

module.exports = router;