const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const { isLoggedIn, isOwner } = require('../middleware.js');
const listingController = require('../controllers/listings.js');

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body.listing);  
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);  
    } else {
        next();
    }
};

// All Listings
router.get("/", wrapAsync(listingController.index));

// New Listing Form
router.get("/new", isLoggedIn, listingController.Rendernewform);

// Show Listing
router.get("/:id", wrapAsync(listingController.RendershowForm));

// ✅ Create Listing (protected)
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.RenderListing));

// Edit Listing Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.RenderEditform));

// Update Listing
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.RenderForm));

// Delete Listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
