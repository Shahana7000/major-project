const express = require('express');
const router = express.Router({ mergeParams: true });  // 👈 merge params from parent route
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const {isLoggedIn, isAuthor} = require('../middleware.js')
const ReviewController = require('../controllers/reviews.js')

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
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.createReview));

// Delete review
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(ReviewController.DestroyReview));

module.exports = router;
