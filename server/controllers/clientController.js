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
  const { client, amount, date, operation, title } = req.body;

  let clientDocument = await Client.findOne({ name: client });
  if (!clientDocument) {
    clientDocument = await Client.create({ name: client });
  }

  const transactionDate = date ? new Date(date) : Date.now();
  const transaction = {
    type: operation,
    date: transactionDate,
    amount,
  };
  if (operation === "pay") {
    const defaultTitle = "دفع" + ` ${amount} ` + "جنيه";
    transaction.description = title || defaultTitle;
    clientDocument.debt -= amount;
    clientDocument.transactions.push(transaction);
  } else if (operation === "purchase") {
    const defaultTitle = "شراء" + ` ${amount} ` + "جنيه";
    transaction.description = title || defaultTitle;
    clientDocument.debt += amount;
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
