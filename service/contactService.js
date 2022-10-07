const { Contact } = require("../models");

const createContact = (body) => {
  return Contact.create(body);
};

const getContactById = (contactIdAndUserId) => {
  return Contact.findOne(contactIdAndUserId).populate("owner", "-password");
};

const getAllContacts = ({ owner, favorite = false, limit = 100, page = 1 }) => {
  return Contact.find({ owner, favorite })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate("owner", "-password");
};

const updateContact = (contactIdAndUserId, body) => {
  return Contact.findOneAndUpdate(contactIdAndUserId, body, {
    new: true,
  }).populate("owner", "-password");
};

const removeContact = (contactIdAndUserId) => {
  return Contact.findOneAndRemove(contactIdAndUserId);
};

module.exports = {
  createContact,
  getContactById,
  getAllContacts,
  updateContact,
  removeContact,
};
