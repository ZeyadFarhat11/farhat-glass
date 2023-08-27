const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    client: { type: mongoose.Types.ObjectId, ref: "Client" },
    invoices: [{ type: mongoose.Types.ObjectId, ref: "Invoice" }],
    title: {
      type: String,
      required: [true, "Job title is required"],
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

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
