const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateUsersInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Titre est requis";
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description est requis";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
