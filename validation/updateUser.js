const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateUpdateUserInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.name = !isEmpty(data.name) ? data.name : "";
  data.address = !isEmpty(data.address) ? data.address : "";

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

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
