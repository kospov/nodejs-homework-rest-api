const { User } = require("../models");
const { handleError } = require("../utils");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;

const checkAuth = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
      throw handleError(401, "Not authorized");
    }

    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(id);

    if (!user || !user.token || token !== user.token) {
      throw handleError(401, "Not authorized");
    }

    req.user = user;

    next();
  } catch (err) {
    const authError = handleError(
      err.status || 401,
      err.message || "Not authorized"
    );
    next(authError);
  }
};

module.exports = checkAuth;
