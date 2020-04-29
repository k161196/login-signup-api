const express = require("express");
const { check, body } = require("express-validator");
let jwt = require("jsonwebtoken");
let config = require("../config/index");
const authController = require("../controllers/auth.controller");
const User = require("../models/user.model");
const passport = require("passport");
const router = express.Router();

// router.get('/login',authController.getLogin);
// router.get('/signup',authController.getSignup);
// router.get('/profile',authController.getAddDetails);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("please enter valid email")
      .normalizeEmail(),
    body("password", "password has to be valid")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("plase enter  valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("email already exist");
          }
        });
      })
      .normalizeEmail(),
    body("password", "plase enter valid email")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("password have to match");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.get("/confirmation/:token", authController.confirmationEmail);

/* ------------------------------ google oAuth ------------------------------ */

router.post(
  "/oauth/google",
  passport.authenticate("googleToken", { session: false }),
  authController.oauthGoogle
);
/* -------------------------------------------------------------------------- */

module.exports = router;
