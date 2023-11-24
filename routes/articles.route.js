const express = require("express");
const router = express.Router();
const articles = require("../controller/articles.controller.js");
const uploader = require("../config/multer.js");

router.post(
  "/create",
  uploader.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  articles.create
);
router.get("/", articles.getAllArticles);
router.get("/users/:user", articles.getArticlesByUser);
router.get("/:id", articles.getArticleById);
router.put(
  "/:id",
  uploader.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  articles.updateArticleById
);
router.delete("/:id", articles.deleteArticleById);

module.exports = router;
