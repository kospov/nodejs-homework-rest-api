const Joi = require("joi");
const { passwordRegEx, emailRegEx } = require("../constants");
const { notValidCredantials } = require("../constants");

const loginSchema = Joi.object({
  password: Joi.string()
    .regex(passwordRegEx)
    .message(notValidCredantials)
    .required(),
  email: Joi.string().regex(emailRegEx).message(notValidCredantials).required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

module.exports = loginSchema;
