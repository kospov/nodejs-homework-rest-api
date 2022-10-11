const { User } = require("../models");
const {
  registerSchema,
  loginSchema,
  subscriptionSchema,
} = require("../schemas");
const { notValidCredantials } = require("../constants");
const { validateSchema } = require("../utils");
const { registrateUser, authenticateUser, updateUser } = require("../service");
const { handleError, handleAvatar } = require("../utils");

const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;

const path = require("path");
const fs = require("fs/promises");

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
        avatarURL: gravatar.url(email),
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
      const { password, token, ...rest } = req.user.toObject();

      const currentUser = {
        user: rest,
      };

      res.status(200).json(currentUser);
    } catch (err) {
      next(err);
    }
  }

  static async apiUpdateSubscriptionUser(req, res, next) {
    try {
      validateSchema(subscriptionSchema, req.body);

      const { user, body } = req;

      const result = await updateUser(user.id, body);

      const { password, token: currentToken, ...existUser } = result.toObject();

      const updatedUser = {
        user: existUser,
      };

      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  static async apiUploadUserAvatar(req, res, next) {
    try {
      const { user, file } = req;

      const { path: tempDir, originalname = "" } = file;

      const [extension] = originalname.split(".").reverse();
      const newFileName = `${user.id}.${extension}`;
      const uploadDir = path.join(
        __dirname,
        "../",
        "public",
        "avatars",
        newFileName
      );

      await handleAvatar(`tmp/${originalname}`);

      await fs.rename(tempDir, uploadDir);

      const updatedUser = await updateUser(user.id, {
        avatarURL: path.join("avatars", newFileName),
      });

      const { avatarURL } = updatedUser.toObject();

      res.status(200).json({ avatarURL });
    } catch (err) {
      next(err);
    }
  }
};
