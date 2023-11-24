// var randtoken = require("rand-token");
const keys = require("../config/keys");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateUpdateUserInput = require("../validation/updateUser");
var randtoken = require("rand-token");

const UserModel = require("../models/User");

exports.login = async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(422).send({
      error: true,
      message: errors,
    });
  }

  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: { email: "Aucun utilisateur trouvé avec cet email" },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: { password: "Mot de passe incorrect" },
      });
    }

    const token = jwt.sign({ id: user._id }, keys.secretOrKey, {
      expiresIn: "1h",
    });

    const refreshToken = randtoken.uid(256);
    res
      .cookie("UTK", "Bearer " + token, {
        sameSite: "strict",
        path: "/",
        expires: new Date(new Date().getTime() + 10000 * 1000),
        httpOnly: true,
        secure: true,
      })
      .cookie("RTK", refreshToken, {
        sameSite: "strict",
        path: "/",
        expires: new Date(new Date().getTime() + 10100 * 1000),
        httpOnly: true,
        secure: true,
      });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        job: user.job,
      },
      message: "Connexion réussie",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erreur interne du serveur lors de la connexion de l'utilisateur",
    });
  }
};

exports.register = async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(422).send({
      error: true,
      message: errors,
    });
  }

  try {
    const { name, email, password, address, job, phone } = req.body;

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: { email: "Un utilisateur avec cet email existe déjà" },
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name: name,
      email: email,
      phone: phone,
      job: job,
      address: address,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({ message: "Inscription réussie" });
  } catch (error) {
    return res.status(500).json({
      error:
        "Erreur interne du serveur lors de l'enregistrement de l'utilisateur",
    });
  }
};

exports.getUserInfo = async (req, res) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, keys.secretOrKey);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        error: true,
        message: { user: "Utilisateur introuvable" },
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        job: user.job,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations de l'utilisateur :",
      error
    );

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: true,
        message: { token: "Token invalide" },
      });
    }

    return res.status(500).json({
      error:
        "Erreur interne du serveur lors de la récupération des informations de l'utilisateur",
    });
  }
};
exports.updateUserInfo = async (req, res) => {
  const { name, email, address, job, phone } = req.body;
  const { errors, isValid } = validateUpdateUserInput(req.body);

  if (!isValid) {
    return res.status(422).send({
      error: true,
      message: errors,
    });
  }
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, keys.secretOrKey);
    const imagePath =
      req.files && req.files["avatar"] ? req.files["avatar"][0].path : null;
    const updateFields = {
      name: name,
      email: email,
      address: address,
      job: job,
      phone: phone,
    };
    if (imagePath !== null) {
      updateFields.avatar = imagePath;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      decoded.id,
      updateFields,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        error: true,
        message: { user: "Utilisateur introuvable" },
      });
    }

    return res.status(200).json({
      message: "Informations de l'utilisateur mises à jour avec succès",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        job: updatedUser.job,
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des informations de l'utilisateur :",
      error
    );

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: true,
        message: { token: "Token invalide" },
      });
    }

    return res.status(500).json({
      error:
        "Erreur interne du serveur lors de la mise à jour des informations de l'utilisateur",
    });
  }
};
exports.logout = (req, res) => {
  res.status(200).json({
    error: false,
    message: "Déonnecter avec Succès",
    data: null,
  });
};
