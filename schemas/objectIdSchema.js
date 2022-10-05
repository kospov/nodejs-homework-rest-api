const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const objectIdSchema = Joi.objectId();

module.exports = objectIdSchema;
