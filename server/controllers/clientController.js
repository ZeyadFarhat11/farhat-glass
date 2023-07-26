const Client = require("../models/clientModel");
const Invoice = require("../models/invoiceModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status-codes");

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
  // res.cookie("cookie", "cookieValue", { maxAge: 5000000, httpOnly: true });
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
  if (transaction.type === "purchase") {
    clientDocument.debt -= transaction.amount;
  } else {
    clientDocument.debt += transaction.amount;
  }
  clientDocument.transactions = clientDocument.transactions.filter(
    (t) => String(t._id) !== req.params.transactionId
  );
  await clientDocument.save();
  res.json(clientDocument);
});
