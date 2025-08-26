const Joi = require('joi');

const listingSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
        filename: Joi.string().allow(''),
        url: Joi.alternatives().try(
            // Absolute URLs ending with image extension
            Joi.string().uri().pattern(/\.(jpg|jpeg|png|webp)$/i),

            // Relative paths like /images/default.jpg, /uploads/abc.png
            Joi.string().pattern(/^\/.*\.(jpg|jpeg|png|webp)$/i)
        ).allow('')
    }).optional()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()  // ✅ closing and required for inner object
});

// const reviewSchema = Joi.object({
//     rating: Joi.number().required().min(1).max(5),
//     comment: Joi.string().required()
// });

module.exports = {
    listingSchema,
    reviewSchema
};
