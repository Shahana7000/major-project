const mongoose = require('mongoose')
const { Schema } = mongoose 

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
//     image :{
//         type : String,
//         default : "https://unsplash.com/photos/SVTBVz8mcOY",
//         Set : (v) => {
//             v === " " ? "https://unsplash.com/photos/SVTBVz8mcOY": v 
//         }
    
// },
image: {
    filename: String,
    url: {
        type: String,
        default: "https://unsplash.com/photos/SVTBVz8mcOY"
    }
},
   image: {
        filename: String,
        url: {
            type: String,
            default: "https://unsplash.com/photos/SVTBVz8mcOY",
            validate: {
                validator: function(v) {
                    // Accept any valid URL
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

    location : String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"

        },

    ]
})


const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing;

