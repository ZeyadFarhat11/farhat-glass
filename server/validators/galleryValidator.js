const { body, param, query } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
const GalleryImage = require("../models/galleryImageModel");

const checkImageId = async (id, { req }) => {
  const document = await GalleryImage.findById(id);
  if (!document) throw new Error();
  req.imageDocument = document;
};

exports.validateDeleteImage = [
  param("id", "Invalid image id").custom(checkImageId),
  checkValidationErrors,
];

exports.validateAddImage = [
  query("type").isIn(GalleryImage.imageTypes),
  checkValidationErrors,
];

exports.validateEditImageType = [
  param("id", "Invalid image id").custom(checkImageId),
  body("type").isIn(GalleryImage.imageTypes),
  checkValidationErrors,
];
