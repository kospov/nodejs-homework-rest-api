const { Contact } = require("../models");

const createContact = (body) => {
  return Contact.create(body);
};

const getContactById = (id) => {
  return Contact.findById(id);
};

const getAllContacts = (owner) => {
  return Contact.find({ owner }).populate("owner", "-password");
};

const updateContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body, { new: true });
};

const updateStatusContact = (id, body) => {
  return Contact.findByIdAndUpdate(id, body, { new: true });
};

const removeContact = (id) => {
  return Contact.findByIdAndRemove(id);
};

module.exports = {
  createContact,
  getContactById,
  getAllContacts,
  updateContact,
  updateStatusContact,
  removeContact,
};
