const { User } = require("../models");
const { registerSchema, loginSchema } = require("../schemas");
const { notValidCredantials } = require("../constants");
const { validateSchema } = require("../utils");
const {
  registrateUser,
  authenticateUser,
  getUserByToken,
} = require("../service/userService");
const { handleError } = require("../utils");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;

module.exports = class UserCtrl {
  static async apiRegistrateUser(req, res, next) {
    try {
      validateSchema(registerSchema, req.body);

      const { password, email, subscription } = req.body;

      const user = await User.findOne({ email });

      if (user) {
        throw handleError(409, "Email in use");
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const result = await registrateUser({
        password: hash,
        email,
        subscription,
      });

      const { password: newPassword, ...newUser } = result.toObject();

      const authUser = {
        user: newUser,
      };

      res.status(201).json(authUser);
    } catch (err) {
      next(err);
    }
  }

  static async apiLoginUser(req, res, next) {
    try {
      validateSchema(loginSchema, req.body);

      const { password, email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        throw handleError(401, notValidCredantials);
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw handleError(401, notValidCredantials);
      }

      const { password: existPassword, ...existUser } = user.toObject();
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "2 days",
      });

      await authenticateUser(user.id, { token });

      const authUser = {
        user: existUser,
        token,
      };

      res.status(200).json(authUser);
    } catch (err) {
      next(err);
    }
  }

  static async apiLogoutUser(req, res, next) {
    try {
      const { user } = req;

      await authenticateUser(user.id, { token: "" });

      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  static async apiGetCurrentUser(req, res, next) {
    try {
      const { user } = req;

      const { authorization = "" } = req.headers;

      const token = authorization.split(" ")[1];

      if (token !== user.token) {
        throw handleError(401, "Not authorized");
      }

      const result = await getUserByToken({ token });

      const { password, token: currentToken, ...existUser } = result.toObject();

      const currentUser = {
        user: existUser,
      };

      res.status(200).json(currentUser);
    } catch (err) {
      next(err);
    }
  }
};
