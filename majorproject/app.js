const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');



const { listingSchema, reviewSchema } = require('./schema.js');
// const Review = require('./models/review.js');
const listings = require('./routes/listing.js')
const reviews = require('./routes/review.js')
const user = require('./routes/user.js');



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to the DB"))
  .catch(err => console.error("DB connection error:", err));

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
const sessionOptions = {
    secret: "mysupersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    },

};
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings" , listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);


app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page not found'));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});

app.listen(8080, () => {
    console.log("Server is running on ports 8080");
});
