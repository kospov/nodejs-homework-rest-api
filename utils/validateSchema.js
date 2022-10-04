const handleError = require("./handleError");

const validateSchema = (schema, target) => {
  const { err } = schema.validate(target);

  if (err) {
    throw handleError(400, err.message);
  }
};

module.exports = validateSchema;
