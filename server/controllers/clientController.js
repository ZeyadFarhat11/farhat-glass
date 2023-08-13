const Client = require("../models/clientModel");
const Invoice = require("../models/invoiceModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status-codes");

exports.makeTransaction = catchAsync(async (req, res) => {
  const { amount, type, description } = req.body;
  const { clientDocument } = req;

  const transaction = {
    type,
    date: Date.now(),
    amount,
  };
  if (type === "pay") {
    const defaultDescription = "دفع" + ` ${amount} ` + "جنيه";
    transaction.description = description || defaultDescription;
    clientDocument.debt -= amount;
  } else if (type === "purchase") {
    const defaultDescription = "شراء" + ` ${amount} ` + "جنيه";
    transaction.description = description || defaultDescription;
    clientDocument.debt += amount;
  }
  clientDocument.transactions.push(transaction);
  await clientDocument.save();
  res.status(200).json(clientDocument);
});

exports.createClient = catchAsync(async (req, res) => {
  const { name, debt } = req.body;

  const transactions = [];
  if (debt)
    transactions.push({
      type: "purchase",
      description: "الدين المبدئي",
      amount: debt,
    });

  const clientDocument = await Client.create({
    name,
    debt,
    transactions,
  });

  res.status(200).json(clientDocument);
});

exports.getClient = catchAsync(async (req, res) => {
  res.status(200).json(req.clientDocument);
});

exports.updateClient = catchAsync(async (req, res) => {
  const { clientDocument } = req;
  clientDocument.name = req.body.name || clientDocument.name;
  await clientDocument.save();
  res.json(clientDocument);
});
exports.deleteClient = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Invoice.deleteMany({ client: id });
  await Client.deleteOne({ _id: id });
  res.sendStatus(200);
});
exports.deleteAllClients = catchAsync(async (req, res) => {
  await Client.deleteMany({});
  res.sendStatus(200);
});

exports.getAllClients = catchAsync(async (req, res) => {
  let clients = await new APIFeatures(Client.find(), req.query)
    .selectFields()
    .query.lean();
  clients = clients.map((client) => ({
    ...client,
    transactionCount: client.transactions?.length,
    transactions: undefined,
  }));
  res.status(200).json(clients);
});

exports.deleteTransaction = catchAsync(async (req, res) => {
  const { clientDocument, transaction } = req;

  if (transaction.invoice) {
    await Invoice.findByIdAndDelete(transaction.invoice);
  }

  clientDocument.transactions = clientDocument.transactions.filter(
    (t) => String(t._id) !== req.params.transactionId
  );
  await clientDocument.calcDebt();

  await clientDocument.save();
  res.json(clientDocument);
});
