// const express = require('express');
// const router = express.Router();
// const Listing = require('../models/listing.js');
// const wrapAsync = require('../utils/wrapAsync.js');
// const ExpressError = require('../utils/ExpressError.js');
// const { listingSchema, reviewSchema } = require('../schema.js');
// const Review = require('../models/review.js');


// const validateReview = (req, res, next) =>{
//     let {error} = reviewSchema.validate(req.body.review);
//     if(error){
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400, error)
//     }else{
//         next()
//     }
// }


// router.post("/", validateReview, wrapAsync(async (req, res) => {
//     try {
//         const listing = await Listing.findById(req.params.id);
//         if (!listing) {
//             return res.status(404).send("Listing not found");
//         }

//         const newReview = new Review(req.body.review);
//         listing.reviews.push(newReview);

//         await newReview.save();
//         await listing.save();

//         console.log("New review saved");
//         res.status(201).redirect(`/listings/${listing._id}`)
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server error while saving review");
//     }

// }));

// router.delete("/:reviewId" , wrapAsync(async(req, res ) =>{
//     let {id, reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
//    await Review.findByIdAndDelete(reviewId);

// res.redirect(`/listings/${id}`)

// }))
// module.exports = router;
const express = require('express');
const router = express.Router({ mergeParams: true });  // 👈 merge params from parent route
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');

// Middleware to validate review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Add new review
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("✅ New review saved");
    res.status(201).redirect(`/listings/${listing._id}`);
}));

// Delete review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    console.log("❌ Review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
