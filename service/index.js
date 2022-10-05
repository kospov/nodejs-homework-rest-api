const contactService = require("./contactService");
const userService = require("./userService");

module.exports = {
  ...contactService,
  ...userService,
};
