const handleError = require("./handleError");

const checkExistDocument = (document) => {
  if (!document) {
    throw handleError(404, `Not Found`);
  }
};

module.exports = checkExistDocument;
