const {
  createContactSchema,
  objectIdSchema,
  updateStatusContactSchema,
} = require("../schemas");

const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  updateStatusContact,
  removeContact,
} = require("../service");

const { validateSchema, checkExistDocument } = require("../utils");

module.exports = class ContactCtlr {
  static async apiCreateContact(req, res, next) {
    try {
      const { user } = req;

      validateSchema(createContactSchema, req.body);

      const contact = await createContact({ ...req.body, owner: user.id });
      res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async apiGetAllContacts(req, res, next) {
    try {
      const contacts = await getAllContacts(req.user.id);

      checkExistDocument(contacts);

      res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  static async apiGetContactById(req, res, next) {
    try {
      validateSchema(objectIdSchema, req.params.id);

      const contact = await getContactById(req.params.id);

      checkExistDocument(contact);

      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async apiUpdateContact(req, res, next) {
    try {
      validateSchema(objectIdSchema, req.params.id);

      validateSchema(createContactSchema, req.body);

      const contact = await updateContact(req.params.id, req.body);

      checkExistDocument(contact);

      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async apiUpdateStatusContact(req, res, next) {
    try {
      validateSchema(objectIdSchema, req.params.id);

      validateSchema(updateStatusContactSchema, req.body);

      const contact = await updateStatusContact(req.params.id, req.body);

      checkExistDocument(contact);

      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async apiRemoveContact(req, res, next) {
    try {
      validateSchema(objectIdSchema, req.params.id);

      const contact = await removeContact(req.params.id);

      checkExistDocument(contact);

      res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }
};
