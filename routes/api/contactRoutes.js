const express = require("express");
const router = express.Router();
const { ContactCtlr } = require("../../controller");
const { checkAuth } = require("../../middlewares");

router.use(checkAuth);

router.post("/", ContactCtlr.apiCreateContact);
router.get("/", ContactCtlr.apiGetAllContacts);
router.get("/:id", ContactCtlr.apiGetContactById);
router.put("/:id", ContactCtlr.apiUpdateContact);
router.patch("/:id/favorite", ContactCtlr.apiUpdateStatusContact);
router.delete("/:id", ContactCtlr.apiRemoveContact);

module.exports = router;
