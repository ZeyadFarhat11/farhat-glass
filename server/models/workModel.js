const mongoose = require("mongoose");
const { Schema } = mongoose;

const workSchema = new Schema(
  {
    client: { type: mongoose.Types.ObjectId, ref: "Client" },
    invoices: [{ type: mongoose.Types.ObjectId, ref: "Invoice" }],
    title: {
      type: String,
      required: [true, "Work title is required"],
    },
    workTime: {
      type: [
        {
          from: Number,
          to: Number,
        },
      ],
      default: [],
    },
    workDone: {
      type: Boolean,
      default: false,
    },
    images: [String],
    expectedWorkDays: Number,
    currentWorkDays: {
      type: Number,
      default: 0,
    },
    workDiagram: [String],
    comments: {
      type: [
        {
          user: {
            type: String,
            minlength: 3,
            maxlength: 32,
            trim: true,
          },
          message: {
            type: String,
            minlength: 3,
            maxlength: 520,
            trim: true,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Work = mongoose.model("Work", workSchema);

module.exports = Work;
