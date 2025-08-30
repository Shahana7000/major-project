const User = require('../models/user');
const Listing = require('../models/listing');
const review = require('../models/review');


module.exports.signupRender = (req, res) =>{
    res.render("users/signup.ejs")
};

module.exports.SignupFunction = async(req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {   // ✅ auto-login after signup
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust, " + registeredUser.username + "!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);   // ✅ fixed
        res.redirect("/signup");
    }
};

module.exports.LoginAuth = (req, res) =>{
    res.render("users/login.ejs")
};

module.exports.LoginAuthentication = async (req, res) => {
        req.flash("success", "Welcome back! You are now logged in.");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
        // res.redirect(redirectUrl)  
    }

module.exports.Logout = (req, res, next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success" , "logged out!");
        res.redirect("/listings")
    })
}    

