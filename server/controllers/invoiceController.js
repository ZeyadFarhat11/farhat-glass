const catchAsync = require("../utils/catchAsync");
const Client = require("../models/clientModel");
const Invoice = require("../models/invoiceModel");
const APIFeatures = require("../utils/APIFeatures");
const calcInvoiceTotal = (rows) =>
  rows.map((row) => +row.at(-1)).reduce((a, b) => a + b, 0);

exports.createInvoice = catchAsync(async (req, res) => {
  let { rows, date, client, title, priceOffer } = req.body;

  let clientDocument = await Client.findById(client);

  const invoiceDateMS = date || Date.now();
  let total = calcInvoiceTotal(rows);

  const invoiceDocument = await Invoice.create({
    client,
    date: invoiceDateMS,
    rows,
    total,
    title,
    priceOffer,
  });

  const transaction = {
    type: "purchase",
    amount: total,
    invoice: invoiceDocument._id,
  };

  if (clientDocument && !priceOffer) {
    clientDocument.transactions.push(transaction);
    clientDocument.debt += total;
    await clientDocument.save();
  }

  await invoiceDocument.populate("client", "name");
  res.status(200).json(invoiceDocument);
});

exports.updateInvoice = async (req, res) => {
  let { invoiceDocument, clientDocument } = req;
  console.log({ requestBody: req.body });
  let total = calcInvoiceTotal(req.body.rows);

  // if updated the client
  if (
    clientDocument &&
    String(invoiceDocument.client?._id) !== String(clientDocument?._id)
  ) {
    // update new client
    const transaction = {
      type: "purchase",
      date: Date.now(),
      amount: total,
      invoice: invoiceDocument._id,
    };
    clientDocument.transactions.push(transaction);
    clientDocument.debt += total;
    await clientDocument.save();

    // update previous client
    if (invoiceDocument.client) {
      invoiceDocument.client.debt -= invoiceDocument.total;
      invoiceDocument.client.transactions =
        invoiceDocument.client.transactions.filter(
          (trans) => String(trans.invoice) !== String(invoiceDocument._id)
        );

      await invoiceDocument.client.save();
    }
  } else if (
    invoiceDocument.client &&
    String(invoiceDocument.client._id) === String(clientDocument?._id)
  ) {
    const transaction = clientDocument.transactions.find(
      (t) => String(t.invoice) === String(invoiceDocument._id)
    );
    if (transaction) transaction.amount = total;
    await clientDocument.calcDebt();
  }

  if (req.body.priceOffer && clientDocument) {
    clientDocument.transactions = clientDocument.transactions.filter(
      (t) => String(t.invoice) !== String(invoiceDocument._id)
    );
  } else if (!req.body.priceOffer && clientDocument) {
    const transactionExist = clientDocument.transactions.find(
      (t) => String(t.invoice) === String(invoiceDocument._id)
    );
    if (!transactionExist)
      clientDocument.transactions.push({
        type: "purchase",
        date: Date.now(),
        amount: total,
        invoice: invoiceDocument._id,
      });
  }
  if (clientDocument) {
    await clientDocument.calcDebt();
    await clientDocument.save();
  }

  invoiceDocument.title = req.body.title;
  invoiceDocument.rows = req.body.rows;
  invoiceDocument.total = total;
  invoiceDocument.date = req.body.date;
  invoiceDocument.priceOffer = req.body.priceOffer;
  if (clientDocument) invoiceDocument.client = clientDocument.id;

  await invoiceDocument.save();
  await invoiceDocument.populate("client", "name debt");
  res.json(invoiceDocument);
};

exports.getInvoice = (req, res) => {
  const { invoiceDocument } = req;
  res.status(200).json(invoiceDocument);
};

exports.getAllInvoices = catchAsync(async (req, res) => {
  const invoices = await new APIFeatures(Invoice.find(), req.query)
    .selectFields()
    .query.populate("client", "name");
  // const documents = await Invoice.find().populate("client", "name");
  res.json({ count: invoices.length, invoices });
});

exports.deleteInvoice = catchAsync(async (req, res) => {
  const { invoiceDocument } = req;
  let clientDocument = await Client.findById(invoiceDocument.client);

  if (clientDocument) {
    clientDocument.transactions = clientDocument.transactions.filter(
      (t) => String(t.invoice) !== String(invoiceDocument._id)
    );
    clientDocument.debt -= invoiceDocument.total;
    await clientDocument.save();
  }
  await invoiceDocument.deleteOne();
  res.sendStatus(200);
});

exports.deleteAllInvoices = catchAsync(async (req, res) => {
  await Invoice.deleteMany();
  res.sendStatus(200);
});
