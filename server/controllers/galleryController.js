const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const cloudinary = require("cloudinary");
const GalleryImage = require("../models/galleryImageModel");
// const {list} = require('./factory')
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + " - " + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Unvalid Image", false);
  }
};

const upload = multer({ storage, fileFilter });
exports.uploadGalleryImages = upload.array("images");

exports.saveImages = catchAsync(async (req, res) => {
  const files = req.files;
  const results = [];

  for (let i in files) {
    let file = files[i];
    let result = await cloudinary.v2.uploader.upload(file.path);
    results.push(result);
  }

  const docs = await GalleryImage.create(
    results.map((image) => ({
      url: image.url,
      type: req.body.type,
      publicId: image.public_id,
    }))
  );

  res.json(docs);
});

exports.deleteImage = catchAsync(async (req, res) => {
  const { imageDocument } = req;
  if (imageDocument.publicId)
    await cloudinary.v2.uploader.destroy(imageDocument.publicId);
  await imageDocument.deleteOne();
  res.sendStatus(200);
});

exports.listImages = catchAsync(async (req, res) => {
  const { type } = req.query;
  let filter = {};
  if (type) filter.type = type;
  const docs = await GalleryImage.find(filter);
  res.json(docs);
});
