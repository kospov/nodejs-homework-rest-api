const Joi = require("joi");
const { passwordRegEx, emailRegEx } = require("../constants");

const registerSchema = Joi.object({
  password: Joi.string()
    .regex(passwordRegEx)
    .message("Not valid password")
    .required(),
  email: Joi.string().regex(emailRegEx).message("Not valid email").required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

module.exports = registerSchema;
