const c = require("../controllers/galleryController");
const checkAdmin = require("../middleware/checkAdmin");
const checkConfirmationCode = require("../middleware/checkConfirmationCode");
const v = require("../validators/galleryValidator");
const { Router } = require("express");
const router = Router();

router
  .route("/gallery")
  .get(c.listImages)
  .post(checkAdmin, c.uploadGalleryImages, c.saveImages)
  .delete(checkAdmin, checkConfirmationCode, c.deleteAllImages);

router
  .route("/gallery/:id")
  .delete(checkAdmin, v.validateDeleteImage, c.deleteImage)
  .patch(v.validateEditImageType, c.editImageType);

module.exports = router;
