const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Minimum 3 characters."],
      maxlength: [32, "Maximum 32 characters."],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [3, "Minimum 3 characters."],
      maxlength: [1000, "Maximum 1000 characters."],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
