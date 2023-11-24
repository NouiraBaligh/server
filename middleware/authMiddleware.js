const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message:
          "Accès non autorisé. Token manquant dans l'en-tête de la requête.",
      });
    }
    const decoded = jwt.verify(token, keys.secretOrKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    return res.status(401).json({ message: "Token invalide." });
  }
};
