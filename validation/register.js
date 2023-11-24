const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.name = !isEmpty(data.name) ? data.name : "";
  data.address = !isEmpty(data.address) ? data.address : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email est requis";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email non valide";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Nom est requis";
  }
  if (Validator.isEmpty(data.address)) {
    errors.address = "Adresse est requis";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Le mot de passe est requis";
  } else if (!Validator.isLength(data.password, { min: 6 })) {
    errors.password = "Le mot de passe doit contenir au moins 6 caractères";
  }
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "La confirmation du mot de passe est requise";
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
