const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport')
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local")

router.get("/signup", (req, res) =>{
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async(req, res) =>{
    try{
         let {username, email, password} = req.body;
         const newUser = new User({email, username})
         const registeredUser = await User.register(newUser, password);
         console.log(registeredUser);
         req.flash("success" , "user was registered!");
         res.redirect("/listings")


    }catch(err){
        req.flash("error", "err.message");
        res.redirect("/signup")
    }
   

}));

router.get("/login", (req, res) =>{
    res.render("users/login.ejs")
});

router.post("/login", 
    passport.authenticate('local', { failureRedirect: "/login", failureFlash: true }), 
    async (req, res) => {
        req.flash("success", "Welcome back! You are now logged in.");
        res.redirect("/listings");  
    }
);





module.exports = router;

