const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    filename: {
      type: String,
      require: [true, "filename is required"],
    },
    filepath: {
      type: String,
      require: [true, "filename is required"],
    },
    client: {
      // type: { type: Schema.Types.ObjectId, ref: "Client" },
      type: String,
    },
    invoice_date: {
      type: Date,
      required: [true, "invoice date is required"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
