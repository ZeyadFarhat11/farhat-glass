const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    client: {
      type: mongoose.Types.ObjectId,
      ref: "Client",
    },
    date: {
      type: Date,
      required: [true, "invoice date is required"],
    },
    rows: {
      type: Array,
      required: [true, "Invoice rows is required"],
      minlength: 1,
    },
    total: {
      type: Number,
      required: [true, "Invoice total is required"],
    },
    title: {
      type: String,
    },
    priceOffer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
