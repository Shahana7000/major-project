const mongoose = require('mongoose')
const { Schema } = mongoose 
const Review = require('./review')

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,

    image: {
        filename: String,
        url: {
            type: String,
            default: "https://unsplash.com/photos/SVTBVz8mcOY",
            validate: {
                validator: function(v) {
                    return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp|bmp|tiff|ico)|https?:\/\/.*)/i.test(v);
                },
                message: props => `${props.value} is not a valid image URL!`
            }
        }
    },

    price: {
        type: Number,
        required: true,
        default: 0
    },

    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});


listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
         await Review.deleteMany({_id : {$in: listing.reviews}})

    }
   

})

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing;

