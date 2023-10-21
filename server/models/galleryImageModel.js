const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageTypes = [
  "shawer",
  "staircase",
  "frontage",
  "mirror",
  "structure",
  "other",
];

const galleryImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: imageTypes,
    },
    publicId: {
      type: String,
      required: true,
    },
    width: Number,
    height: Number,
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const GalleryImage = mongoose.model(
  "GalleryImage",
  galleryImageSchema,
  "gallery_images"
);
GalleryImage.imageTypes = imageTypes;

module.exports = GalleryImage;
