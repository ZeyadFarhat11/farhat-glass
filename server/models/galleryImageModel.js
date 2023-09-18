const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageTypes = ["shawer", "staircase", "frontage", "mirror"];

const galleryImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: imageTypes,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
GalleryImage.imageTypes = imageTypes;

module.exports = GalleryImage;
