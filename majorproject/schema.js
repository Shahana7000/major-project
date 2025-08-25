const Joi = require('joi');

const listingSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
        filename: Joi.string().allow(''),
        url: Joi.string().uri().allow('')
    }).optional()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

// 👇 single export me dono bhej do
module.exports = {
    listingSchema,
    reviewSchema
};
