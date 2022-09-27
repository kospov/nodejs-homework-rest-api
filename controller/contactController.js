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

const { handleError } = require("../utils/handleError");

module.exports = class ContactCtlr {
  static async apiCreateContact(req, res, next) {
    try {
      const { error } = createContactSchema.validate(req.body);

      if (error) {
        throw handleError(400, "missing required name field");
      }

      const contact = await createContact(req.body);
      res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async apiGetAllContacts(req, res, next) {
    try {
      const contacts = await getAllContacts();

      if (!contacts) {
        res.status(404).json({ message: "There are no contacts saved yet!" });
      }

      res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  static async apiGetContactById(req, res, next) {
    try {
      const { error } = objectIdSchema.validate(req.params.id);

      if (error) {
        next(error);
      }

      const contact = await getContactById(req.params.id);

      if (!contact) {
        throw handleError(404, "Not found");
      }
      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async apiUpdateContact(req, res, next) {
    try {
      const { error: idErr } = objectIdSchema.validate(req.params.id);

      if (idErr) {
        next(idErr);
      }

      const { error: bodyErr } = createContactSchema.validate(req.body);

      if (bodyErr) {
        throw handleError(400, "missing required name field");
      }

      const contact = await updateContact(req.params.id, req.body);

      if (!contact) {
        throw handleError(404, "Not found");
      }
      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async apiUpdateStatusContact(req, res, next) {
    try {
      const { error: idErr } = objectIdSchema.validate(req.params.id);

      if (idErr) {
        next(400, idErr);
      }

      const { error: bodyErr } = updateStatusContactSchema.validate(req.body);

      if (bodyErr) {
        throw handleError(400, "missing field favorite");
      }

      const contact = await updateStatusContact(req.params.id, req.body);

      if (!contact) {
        throw handleError(404, "Not found");
      }
      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async apiRemoveContact(req, res, next) {
    try {
      const { error } = objectIdSchema.validate(req.params.id);

      if (error) {
        next(error);
      }

      const contact = await removeContact(req.params.id);

      if (!contact) {
        throw handleError(404, "Not found");
      }

      res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }
};
