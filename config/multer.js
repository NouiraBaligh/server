const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, "./public/articles_images");
    } else if (file.fieldname === "avatar") {
      cb(null, "./public/users_avatars");
    }
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") +
        file.fieldname +
        "." +
        extension
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "text/csv"
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = "Extension non autorisée";
    return cb(null, false, req.fileValidationError);
  }
};

module.exports = multer({ storage: storage, fileFilter: fileFilter });
