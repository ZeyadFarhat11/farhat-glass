const mongoose = require("mongoose");
const { Schema } = mongoose;

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
      type: [
        {
          _id: false,
          title: {
            type: String,
            required: [true, "transaction title is required"],
            minlength: [3, "Minimum 3 characters"],
            maxlength: [500, "Maximum 500 characters"],
          },
          date: {
            type: Date,
            default: Date.now,
          },
          amount: {
            type: Number,
            required: [true, "Transaction amount is required"],
          },
        },
      ],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
