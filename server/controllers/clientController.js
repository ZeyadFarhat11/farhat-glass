const Client = require("../models/clientModel");
const catchAsync = require("../utils/catchAsync");

exports.createClient = catchAsync(async (req, res) => {
  const { name, debt, transactions } = req.body;
  if (!name) {
    res.status(400).json({ message: "Client name is required" });
    return;
  }
  const clientDocument = await Client.create({ name, debt, transactions });

  res.status(200).json(clientDocument);
});

exports.makeTransaction = catchAsync(async (req, res) => {
  const { name, amount, date, operation, title } = req.body;
  if (!name) {
    res.status(400).json({ message: "Client name is required" });
    return;
  } else if (!amount || typeof amount !== "number") {
    res.status(400).json({ message: "Amount is invalid" });
    return;
  }
  const clientDocument = await Client.findOne({ name });
  if (!clientDocument) {
    res.status(400).json({ message: "Client name is invalid" });
    return;
  }

  const transactionDate = date ? new Date(date) : Date.now();
  if (operation === "pay") {
    const transactionTitle = title || "دفع" + ` ${amount} ` + "جنيه";
    clientDocument.debt -= amount;
    const transaction = {
      title: transactionTitle,
      date: transactionDate,
      amount,
    };
    clientDocument.transactions.push(transaction);
  } else if (operation === "purchase") {
    const transactionTitle = title || "شراء" + ` ${amount} ` + "جنيه";
    clientDocument.debt += amount;
    const transaction = {
      title: transactionTitle,
      date: transactionDate,
      amount,
    };
    clientDocument.transactions.push(transaction);
  }
  await clientDocument.save();
  res.status(200).json(clientDocument);
});

exports.getClient = catchAsync(async (req, res) => {
  const { name } = req.params;
  const clientDocument = await Client.findOne({ name });
  if (!clientDocument) {
    res.status(400).json({ message: "Client name is invalid" });
    return;
  }
  res.status(200).json(clientDocument);
});
