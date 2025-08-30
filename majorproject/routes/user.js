const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport')
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require('../middleware');
const UserController = require('../controllers/user')

router.get("/signup", UserController.signupRender);

router.post("/signup", wrapAsync(UserController.SignupFunction));


router.get("/login", UserController.LoginAuth);

router.post("/login", 
      saveRedirectUrl, passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), 
    UserController.LoginAuthentication
);

router.get("/logout" , UserController.Logout);





module.exports = router;

