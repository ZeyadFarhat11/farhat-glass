const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, "transaction type is required"],
      enum: ["pay", "purchase"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      index: true,
      unique: true,
    },
    debt: {
      type: Number,
      default: 0,
    },
    transactions: {
      type: [transactionSchema],
      default: [],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

clientSchema.methods.updateDocument = function (requestBody) {
  delete requestBody.transactions;
  delete requestBody.debt;
  delete requestBody._id;
  for (let key in requestBody) {
    this[key] = requestBody[key];
  }
};

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
