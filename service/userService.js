const { User } = require("../models");

const registrateUser = (body) => {
  return User.create(body);
};

const authenticateUser = (id, token) => {
  return User.findByIdAndUpdate(id, token, { new: true });
};

const getUserByToken = (token) => {
  return User.findOne(token);
};

module.exports = {
  registrateUser,
  authenticateUser,
  getUserByToken,
};
