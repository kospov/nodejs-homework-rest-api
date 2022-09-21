const fs = require("fs/promises");
const path = require("path");
const { handleError } = require("../utils/handleError");
const { v4: uuid } = require("uuid");
const { schema } = require("..//schemas/createContactSchema");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const result = await fs.readFile(contactsPath);
  return JSON.parse(result);
};

const getById = async (contactId) => {
  const result = await listContacts();
  const contact = result.find(({ id }) => id === contactId);

  if (!contact) {
    throw handleError(404, "Not found");
  }
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(({ id }) => id === contactId);

  if (contactIndex === -1) {
    throw handleError(404, "Not found");
  }

  contacts.splice(contactIndex, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
};

const addContact = async (body) => {
  const { name, email, phone } = body;

  if (!name || !email || !phone) {
    throw handleError(400, "missing required name field");
  }

  const contacts = await listContacts();
  const newContact = { id: uuid(), name, email, phone };

  const { error } = schema.validate(body);
  if (error) {
    throw error;
  }

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");

  return newContact;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;

  if (!name && !email && !phone) {
    throw handleError(400, "missing fields");
  }

  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(({ id }) => id === contactId);

  if (contactIndex === -1) {
    throw handleError(404, "Not found");
  }

  const { error } = schema.validate(body);
  if (error) {
    throw error;
  }

  contacts[contactIndex].name = name;
  contacts[contactIndex].email = email;
  contacts[contactIndex].phone = phone;

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");

  return contacts[contactIndex];
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
