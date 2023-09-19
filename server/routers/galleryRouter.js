const c = require("../controllers/galleryController");
const v = require("../validators/galleryValidator");
const { Router } = require("express");
const router = Router();

router.post("/gallery", c.uploadGalleryImages, c.saveImages);

router.delete("/gallery/:id", v.validateDeleteImage, c.deleteImage);

router.get("/gallery", c.listImages);

module.exports = router;
