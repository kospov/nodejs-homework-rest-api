const express = require("express");
const router = express.Router();
const { ContactCtlr } = require("../../controller");
const { checkAuth } = require("../../middlewares");

router.post("/", checkAuth, ContactCtlr.apiCreateContact);

router.get("/", checkAuth, ContactCtlr.apiGetAllContacts);

router.get("/:id", checkAuth, ContactCtlr.apiGetContactById);

router.put("/:id", checkAuth, ContactCtlr.apiUpdateContact);

router.patch("/:id/favorite", checkAuth, ContactCtlr.apiUpdateStatusContact);

router.delete("/:id", checkAuth, ContactCtlr.apiRemoveContact);

module.exports = router;
