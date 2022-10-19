const { User } = require("../models");
const {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  emailSchema,
} = require("../schemas");
const { notValidCredantials } = require("../constants");
const { validateSchema } = require("../utils");
const { registrateUser, authenticateUser, updateUser } = require("../service");
const { handleError, handleAvatar, sendEmail } = require("../utils");

const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET, HOST, PORT } = process.env;
const port = Number(PORT);

const path = require("path");
const fs = require("fs/promises");
const { v4: uuid } = require("uuid");

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
      const verificationToken = uuid();

      const result = await registrateUser({
        password: hash,
        email,
        subscription,
        avatarURL: gravatar.url(email),
        verificationToken,
      });

      sendEmail({
        to: email,
        subject: "Confirm Email",
        html: `<a href="${HOST}${port}/api/users/verify/${verificationToken}">Confirm Email</a>`,
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

      if (!user.verify) {
        throw handleError(401, "Email not verified");
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

  static async apiGetUserByVerificationToken(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const user = await User.findOne({ verificationToken });

      if (!user) {
        throw handleError(404, "User not found");
      }

      console.log(user.id);

      await updateUser(user.id, { verificationToken: null, verify: true });

      res.status(200).json("Verification successful");
    } catch (err) {
      next(err);
    }
  }

  static async apiResendVerificationTokenToUser(req, res, next) {
    try {
      validateSchema(emailSchema, req.body);

      const { email } = req.body;

      if (!email) {
        throw handleError(400, "missing required field email");
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw handleError(404, "User not found");
      }

      if (user.verify) {
        throw handleError(400, "Verification has already been passed");
      }

      sendEmail({
        to: email,
        subject: "Confirm Email",
        html: `<a href="${HOST}${port}/api/users/verify/${user.verificationToken}">Confirm Email</a>`,
      });

      res.status(200).json({ message: "Verification email sent" });
    } catch (err) {
      next(err);
    }
  }
};
