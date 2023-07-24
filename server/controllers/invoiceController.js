const path = require("path");
const catchAsync = require("../utils/catchAsync");
const InvoiceHTML = require("../utils/Invoice");
const Client = require("../models/clientModel");
const Invoice = require("../models/invoiceModel");

const calcInvoiceTotal = (rows) =>
  rows.map((row) => +row.at(-1)).reduce((a, b) => a + b, 0);

exports.createInvoice = catchAsync(async (req, res) => {
  let { rows, date, total, client, title } = req.body;

  let clientDocument = await Client.findById(client);

  const invoiceDateMS = date || Date.now();
  total = total || calcInvoiceTotal(rows);

  const invoiceDocument = await Invoice.create({
    client,
    date: invoiceDateMS,
    rows,
    total,
    title,
  });

  const transaction = {
    type: "purchase",
    amount: total,
    invoice: invoiceDocument._id,
  };

  if (clientDocument) {
    clientDocument.transactions.push(transaction);
    clientDocument.debt += total;
    await clientDocument.save();
  }

  const invoiceUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}/${
    invoiceDocument._id
  }`;
  await invoiceDocument.populate("client", "name");
  res.status(200).json({ ...invoiceDocument.toObject(), url: invoiceUrl });
});

exports.updateInvoice = async (req, res) => {
  let { invoiceDocument, clientDocument } = req;

  // if updated the client
  if (
    clientDocument &&
    String(invoiceDocument.client?._id) !== String(clientDocument?._id)
  ) {
    // update new client
    const transaction = {
      type: "purchase",
      date: Date.now(),
      amount: req.body.total,
      invoice: invoiceDocument._id,
    };
    clientDocument.transactions.push(transaction);
    clientDocument.debt += req.body.total;
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
  }

  invoiceDocument.title = req.body.title;
  invoiceDocument.rows = req.body.rows;
  invoiceDocument.total = req.body.total;
  invoiceDocument.date = req.body.date;
  if (clientDocument) invoiceDocument.client = clientDocument.id;

  await invoiceDocument.save();
  await invoiceDocument.populate("client", "name debt");
  res.json(invoiceDocument);
};

exports.getInvoice = (req, res) => {
  const { invoiceDocument } = req;
  // console.log(req.headers)
  if (req.headers["content-type"] === "application/json") {
    res.status(200).json(invoiceDocument);
  }
  const html = new InvoiceHTML(
    path.join(__dirname, "../assets/template-invoice.html")
  )
    .fromInvoiceDocument(invoiceDocument)
    .getHTML();

  res.status(200).send(html);
};

exports.getAllInvoices = catchAsync(async (req, res) => {
  const documents = await Invoice.find().populate("client", "name");
  res.json({ count: documents.length, invoices: documents });
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
