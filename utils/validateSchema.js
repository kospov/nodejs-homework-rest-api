const handleError = require("./handleError");

const validateSchema = (schema, target) => {
  const { error } = schema.validate(target);

  if (error) {
    throw handleError(400, error.message);
  }
};

module.exports = validateSchema;
