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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
