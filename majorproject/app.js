const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require('./models/review.js');

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

app.get("/", (req, res) => {
    res.send("Hello World");
});

const validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error)
    }else{
        next()
    }
}
const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error)
    }else{
        next()
    }
}



app.get("/listings", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

app.get("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show", { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

// ✅ Fixed POST route to handle image links
app.post("/listings", wrapAsync(async (req, res, next) => {
    if (req.body.listing.image) {
        req.body.listing.image = {
            filename: req.body.listing.image.split("/").pop(),
            url: req.body.listing.image
        };
    }

    let result = listingSchema.validate(req.body.listing);
    if(result.error){
        throw new ExpressError(400, result.error);
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res, next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

app.put("/listings/:id", wrapAsync(async(req,res, next) =>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async(req, res, next) =>{
   let { id } = req.params;
   let deletedListing =  await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
}));

//review 
//post routes

app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log("New review saved");
        res.status(201).redirect(`/listings/${listing._id}`)
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error while saving review");
    }

}));

app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req, res ) =>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
   await Review.findByIdAndDelete(reviewId);

res.redirect(`/listings/${id}`)

}))



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
