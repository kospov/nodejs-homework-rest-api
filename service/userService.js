const { User } = require("../models");

const registrateUser = (body) => {
  return User.create(body);
};

const authenticateUser = (id, token) => {
  return User.findByIdAndUpdate(id, token, { new: true });
};

const updateUser = (id, body) => {
  return User.findByIdAndUpdate(id, body, { new: true });
};

module.exports = {
  registrateUser,
  authenticateUser,
  updateUser,
};
