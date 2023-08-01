const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
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
  invoice: {
    type: mongoose.Types.ObjectId,
    ref: "Invoice",
  },
});

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

clientSchema.methods.calcDebt = async function () {
  let transactions = this.transactions;
  if (!this.transactions) {
    const clientDocument = await Client.findById(this._id);
    transactions = clientDocument.transactions;
  }
  this.debt = transactions
    .map((t) => (t.type === "pay" ? -t.amount : t.amount))
    .reduce((a, b) => a + b, 0);
};

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
