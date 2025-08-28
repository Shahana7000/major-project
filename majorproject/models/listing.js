// const mongoose = require('mongoose')
// const { Schema } = mongoose 
// const Review = require('./review')

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   description: String,

//   image: {
//     filename: { type: String, default: "listingimage" },
//     url: {
//       type: String,
//       default: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?...",
//       validate: {
//         validator: function (v) {
//           return /^https?:\/\/.+/i.test(v);
//         },
//         message: props => `${props.value} is not a valid image URL!`
//       }
//     }
//   },

//   price: {
//     type: Number,
//     required: true,
//     default: 0
//   },

//   location: String,
//   country: String,
//   reviews: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Review"
//     }
//   ]
// });



// listingSchema.post("findOneAndDelete", async(listing) => {
//     if(listing){
//          await Review.deleteMany({_id : {$in: listing.reviews}})

//     }
   

// })

// const Listing = mongoose.model('Listing', listingSchema)

// module.exports = Listing;

// const mongoose = require('mongoose');
// const { Schema } = mongoose;
// const Review = require('./review');

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   description: String,

//   image: {
//     filename: { type: String, default: "listingimage" },
//     url: {
//       type: String,
//       default: "/images/default.jpg",
//       validate: {
//         validator: function (v) {
//           // Allow both local paths (/images/...) and full URLs (http/https)
//           return /^https?:\/\/.+/i.test(v) || /^\/images\/.+/i.test(v);
//         },
//         message: props => `${props.value} is not a valid image URL or path!`
//       }
//     }
//   },

//   price: {
//     type: Number,
//     required: true,
//     default: 0
//   },

//   location: String,
//   country: String,
//   reviews: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Review"
//     }
//   ]
// });

// // Cascade delete reviews when listing is deleted
// listingSchema.post("findOneAndDelete", async (listing) => {
//   if (listing) {
//     await Review.deleteMany({ _id: { $in: listing.reviews } });
//   }
// });

// const Listing = mongoose.model('Listing', listingSchema);

// module.exports = Listing;
const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review");

const imageSchema = new Schema({
    url: String,
    filename: {
        type: String,
        required: true,
        default: "default"
    }
});
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    location: String,
    country: String,
    image: {
        type: imageSchema,
        default: {
            url: "/images/default.jpg",  // local image bhi chalega
            filename: "default"
        }
    },

   reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});
// Cascade delete reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
