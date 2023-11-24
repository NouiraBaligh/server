const ArticleModel = require("../models/Article");
const validateUsersInput = require("../validation/articles");

exports.create = async (req, res) => {
  const { title, description, user } = req.body;
  const { errors, isValid } = validateUsersInput(req.body);

  if (!isValid) {
    return res.status(422).send({
      error: true,
      message: errors,
    });
  }

  try {
    const imagePath =
      req.files && req.files["image"] ? req.files["image"][0].path : null;

    if (!imagePath) {
      errors.image = "Image est requise";
      return res.status(422).send({
        error: true,
        message: errors,
      });
    }

    const newArticle = new ArticleModel({
      title,
      description,
      user,
      image: imagePath,
    });

    const savedArticle = await newArticle.save();

    const responseArticle = {
      _id: savedArticle._id,
      title: savedArticle.title,
      description: savedArticle.description,
    };

    res.status(201).json(responseArticle);
  } catch (error) {
    console.error("Erreur lors de la création de l'article :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'article" });
  }
};
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.find().populate("user");

    res.status(200).json(articles);
  } catch (error) {
    console.error("Erreur lors de la récupération des articles :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des articles" });
  }
};
exports.getArticleById = async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'article par ID :",
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'article par ID" });
  }
};
exports.updateArticleById = async (req, res) => {
  const { title, description, user } = req.body;
  const { errors, isValid } = validateUsersInput(req.body);

  if (!isValid) {
    return res.status(422).json({
      error: true,
      message: errors,
    });
  }

  try {
    const imagePath =
      req.files && req.files["image"] ? req.files["image"][0].path : null;

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        user,
        image: imagePath || undefined,
      },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article par ID :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'article par ID" });
  }
};
exports.deleteArticleById = async (req, res) => {
  try {
    const deletedArticle = await ArticleModel.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.status(200).json({ message: "Article supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article par ID :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'article par ID" });
  }
};
exports.getArticlesByUser = async (req, res) => {
  try {
    const userId = req.params.user;
    const articles = await ArticleModel.find({ user: userId });
    res.status(200).json(articles);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des articles de l'utilisateur :",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération des articles de l'utilisateur",
    });
  }
};
