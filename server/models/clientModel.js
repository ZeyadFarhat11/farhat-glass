const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionTypes = ["pay", "purchase", "discount"];
const transactionSchema = new Schema({
  type: {
    type: String,
    required: [true, "transaction type is required"],
    enum: TransactionTypes,
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
    vendor: {
      type: Boolean,
      default: false,
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
    .map((t) =>
      t.type === "pay" || t.type === "discount" ? -t.amount : t.amount
    )
    .reduce((a, b) => a + b, 0);
};

const Client = mongoose.model("Client", clientSchema);
Client.TransactionTypes = TransactionTypes;

module.exports = Client;
