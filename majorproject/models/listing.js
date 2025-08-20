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

    price: {
  type: Number,
  required: true,
  default: 0
},

    location : String,
    country : String,
})


const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing;

