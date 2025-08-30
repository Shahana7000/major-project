const Listing = require("./models/listing");
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) =>{
    // console.log(req.path, "..", req.originalUrl); //original path
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "you must be logged in to create new listing");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) =>{

    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }next();
}

module.exports.isOwner = async(req, res, next) =>{
    const { id } = req.params;
        let listing = await Listing.findById(id);
    
        // Authorization check
        if (!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "you are not the owner of this listing!");
            return res.redirect(`/listings/${listing._id}`);
        }
        next();
    }

module.exports.isAuthor = async(req, res, next) =>{
    const {id, reviewId } = req.params;
        let review = await Review.findById(reviewId);
    
        // Authorization check
        if (!review.author.equals(res.locals.currUser._id)) {
            req.flash("error", "you did not create this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
    }    
