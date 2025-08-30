const Listing = require('../models/listing');
const {listingSchema} = require('../schema.js')




module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.Rendernewform = (req, res) => {
    res.render("listings/new");
}

module.exports.RendershowForm =  async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner");
        if(!listing){
            req.flash("error" , "Listing you requested for doen not exit!");
            res.redirect("/listings");
        }
        console.log(listing)
        res.render("listings/show", { listing });

    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
};

module.exports.RenderListing = async (req, res, next) => {
    let imageUrl = req.body.listing.image;

    if (typeof imageUrl === "string" && imageUrl.trim() !== "") {
        req.body.listing.image = {
            filename: imageUrl.split("/").pop(),
            url: imageUrl
        };
    } else {
        req.body.listing.image = {
            filename: "default.jpg",
            url: "/images/default.jpg"  
        };
    }

    let result = listingSchema.validate(req.body.listing);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }

    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New lisiting added!")
    res.redirect("/listings");
};

module.exports.RenderEditform = async (req, res, next) =>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
            req.flash("error" , "Listing you requested for doen not exit!");
            res.redirect("/listings");
        }
    res.render("listings/edit", { listing });
};

module.exports.RenderForm = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    // Authorization check

    let updatedData = req.body.listing;

    // ✅ Handle image properly
    if (typeof updatedData.image === "string" && updatedData.image.trim() !== "") {
        updatedData.image = {
            filename: updatedData.image.split("/").pop(),
            url: updatedData.image
        };
    } else if (!updatedData.image || updatedData.image === "") {
        delete updatedData.image;
    }

    await Listing.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing= async(req, res, next) =>{
   let { id } = req.params;
   let deletedListing =  await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success" , "Listing Deleted!")
   res.redirect("/listings");
};