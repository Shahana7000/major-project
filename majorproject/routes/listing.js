const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');




const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body.listing);  // ✅ not req.body
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);  // ✅ send message, not Joi object
    } else {
        next();
    }
}


router.get("/", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

router.get("/new", (req, res) => {
    res.render("listings/new");
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        if(!listing){
            req.flash("error" , "Listing you requested for doen not exit!");
            res.redirect("/listings");
        }
        res.render("listings/show", { listing });

    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

// router.post("/", wrapAsync(async (req, res, next) => {
//     if (req.body.listing.image) {
//         req.body.listing.image = {
//             filename: req.body.listing.image.split("/").pop(),
//             url: req.body.listing.image
//         };
//     }

//     let result = listingSchema.validate(req.body.listing);
//     if(result.error){
//         throw new ExpressError(400, result.error);
//     }

//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));
router.post("/", wrapAsync(async (req, res, next) => {
    let imageUrl = req.body.listing.image;

    if (typeof imageUrl === "string" && imageUrl.trim() !== "") {
        req.body.listing.image = {
            filename: imageUrl.split("/").pop(),
            url: imageUrl
        };
    } else {
        req.body.listing.image = {
            filename: "default.jpg",
            url: "/images/default.jpg"  // fallback
        };
    }

    let result = listingSchema.validate(req.body.listing);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New lisiting added!")
    res.redirect("/listings");
}));


router.get("/:id/edit", wrapAsync(async (req, res, next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
            req.flash("error" , "Listing you requested for doen not exit!");
            res.redirect("/listings");
        }
    res.render("listings/edit", { listing });
}));

// router.put("/:id", wrapAsync(async(req,res, next) =>{
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});
//     res.redirect(`/listings/${id}`);
// }));
// router.put("/:id", wrapAsync(async (req, res, next) => {
//     let { id } = req.params;

//     let updatedData = req.body.listing;

//     // if image not provided in form, don't overwrite
//     if (!updatedData.image || updatedData.image.trim() === "") {
//         delete updatedData.image;
//     }

//     await Listing.findByIdAndUpdate(id, updatedData);
//     res.redirect(`/listings/${id}`);
// }));
router.put("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    let updatedData = req.body.listing;

    // ✅ Handle image properly
    if (typeof updatedData.image === "string" && updatedData.image.trim() !== "") {
        updatedData.image = {
            filename: updatedData.image.split("/").pop(),
            url: updatedData.image
        };
    } else if (!updatedData.image || updatedData.image === "") {
        // Agar image field empty hai to hata do
        delete updatedData.image;
    }

    const listing = await Listing.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

    res.redirect(`/listings/${listing._id}`);
}));


router.delete("/:id", wrapAsync(async(req, res, next) =>{
   let { id } = req.params;
   let deletedListing =  await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success" , "Listing Deleted!")
   res.redirect("/listings");
}));
 

module.exports = router;

