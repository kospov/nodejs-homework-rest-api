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
  removeContact,
} = require("../service");

const { validateSchema, checkExistDocument } = require("../utils");

module.exports = class ContactCtlr {
  static async apiCreateContact(req, res, next) {
    try {
      const { user, body } = req;

      validateSchema(createContactSchema, body);

      const contact = await createContact({ ...body, owner: user.id });
      res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async apiGetAllContacts(req, res, next) {
    try {
      const { user } = req;
      const { favorite, limit, page } = req.query;

      const contacts = await getAllContacts({
        owner: user.id,
        favorite,
        limit,
        page,
      });

      checkExistDocument(contacts);

      res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  static async apiGetContactById(req, res, next) {
    try {
      const { user, params } = req;

      validateSchema(objectIdSchema, params.id);

      const contactIdAndUserId = { _id: params.id, owner: user.id };

      const result = await getContactById(contactIdAndUserId);

      checkExistDocument(result);

      const {
        owner: { token, ...currentOwner },
        ...currentContact
      } = result.toObject();

      const contactById = {
        ...currentContact,
        owner: currentOwner,
      };

      res.status(200).json(contactById);
    } catch (err) {
      next(err);
    }
  }

  static async apiUpdateContact(req, res, next) {
    try {
      const { user, params, body } = req;

      validateSchema(objectIdSchema, params.id);
      validateSchema(createContactSchema, body);

      const contactIdAndUserId = { _id: params.id, owner: user.id };

      const result = await updateContact(contactIdAndUserId, body);

      checkExistDocument(result);

      const {
        owner: { token, ...currentOwner },
        ...currentContact
      } = result.toObject();

      const contactById = {
        ...currentContact,
        owner: currentOwner,
      };

      res.status(200).json(contactById);
    } catch (err) {
      next(err);
    }
  }

  static async apiUpdateStatusContact(req, res, next) {
    try {
      const { user, params, body } = req;

      validateSchema(objectIdSchema, params.id);
      validateSchema(updateStatusContactSchema, body);

      const contactIdAndUserId = { _id: params.id, owner: user.id };

      const result = await updateContact(contactIdAndUserId, body);

      checkExistDocument(result);

      const {
        owner: { token, ...currentOwner },
        ...currentContact
      } = result.toObject();

      const contactById = {
        ...currentContact,
        owner: currentOwner,
      };

      res.status(200).json(contactById);
    } catch (err) {
      next(err);
    }
  }

  static async apiRemoveContact(req, res, next) {
    try {
      const { user, params } = req;

      validateSchema(objectIdSchema, params.id);

      const contactIdAndUserId = { _id: params.id, owner: user.id };

      const result = await removeContact(contactIdAndUserId);

      checkExistDocument(result);

      res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }
};
