const express = require("express");
const router = express.Router();
const { UserCtrl } = require("../../controller");
const { checkAuth, upload } = require("../../middlewares");

router.post("/register", UserCtrl.apiRegistrateUser);
router.patch("/login", UserCtrl.apiLoginUser);
router.patch("/logout", checkAuth, UserCtrl.apiLogoutUser);
router.get("/current", checkAuth, UserCtrl.apiGetCurrentUser);
router.patch("/", checkAuth, UserCtrl.apiUpdateSubscriptionUser);
router.patch(
  "/avatars",
  checkAuth,
  upload.single("avatar"),
  UserCtrl.apiUploadUserAvatar
);

module.exports = router;
