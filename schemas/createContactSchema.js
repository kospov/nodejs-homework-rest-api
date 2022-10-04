const Joi = require("joi");
const { nameRegEx, emailRegEx, phoneRegEx } = require("../constants");

const createContactSchema = Joi.object({
  name: Joi.string().regex(nameRegEx).message("Not valid name").required(),
  email: Joi.string().regex(emailRegEx).message("Not valid email").required(),
  phone: Joi.string().regex(phoneRegEx).message("Not valid phone").required(),
  favorite: Joi.boolean(),
});

module.exports = createContactSchema;
