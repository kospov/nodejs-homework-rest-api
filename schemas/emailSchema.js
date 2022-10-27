const Joi = require("joi");
const { emailRegEx } = require("../constants");

const emailSchema = Joi.object({
  email: Joi.string().regex(emailRegEx).message("Not valid email").required(),
});

module.exports = emailSchema;
