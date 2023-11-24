const express = require("express");
const router = express.Router();
const auth = require("../controller/auth.controller.js");
const uploader = require("../config/multer.js");

router.post("/login", auth.login);
router.post("/register", auth.register);
router.get("/checkauth", auth.getUserInfo);
router.put(
  "/update",
  uploader.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  auth.updateUserInfo
);
router.post("/logout", auth.logout);

module.exports = router;
