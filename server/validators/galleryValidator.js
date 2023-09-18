const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
const GalleryImage = require("../models/GalleryImageModel");

const checkImageId = async (id, { req }) => {
  const document = await GalleryImage.findById(id);
  if (!document) throw new Error();
  req.imageDocument = document;
};

exports.validateDeleteImage = [
  param("id", "Unvalid image id").custom(checkImageId),
  checkValidationErrors,
];
