const Joi = require('joi');

const listingSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().min(0).required(), // ✅ number not string
  location: Joi.string().required()
});

module.exports = listingSchema;