const Joi = require("joi");

const updateStatusContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = updateStatusContactSchema;
