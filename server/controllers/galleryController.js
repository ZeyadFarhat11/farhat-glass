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
  const { types } = req.body;
  const results = [];

  console.log({ files, body: req.body });

  for (let file of files) {
    let result = await cloudinary.v2.uploader.upload(file.path);
    results.push(result);
    console.log("Image Upload Result", result);
  }

  const docs = await GalleryImage.create(
    results.map((image, i) => ({
      url: image.url,
      type: Array.isArray(types) ? types[i] : types,
      publicId: image.public_id,
      width: image.width,
      height: image.height,
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

exports.deleteAllImages = catchAsync(async (req, res) => {
  await GalleryImage.deleteMany({});
  const { resources } = await cloudinary.v2.api.resources({
    type: "upload",
    max_results: 500,
  });

  for (const resource of resources) {
    await cloudinary.uploader.destroy(resource.public_id);
  }

  res.sendStatus(204);
});

exports.listImages = catchAsync(async (req, res) => {
  const { type } = req.query;
  let filter = {};
  if (type && type !== "all") filter.type = type;
  const docs = await GalleryImage.find(filter);
  res.json(docs);
});