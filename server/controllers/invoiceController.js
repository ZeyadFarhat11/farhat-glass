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
  res.status(200).json(invoiceDocument);
});

exports.updateInvoice = async (req, res) => {
  let { invoice } = req;
  const { client } = req.body;
  let invoiceClient = await db.clients.findOnePro({ _id: invoice.client });

  // if updated the client
  if (client && invoiceClient.name !== client) {
    let clientDocument = await db.clients.findOnePro({ name: client });
    if (!clientDocument) {
      const currentTime = Date.now();
      clientDocument = await db.clients.insertPro({
        name: client,
        debt: 0,
        transactions: [],
        createdAt: currentTime,
        updatedAt: currentTime,
      });
    }
    // update new client
    const transaction = {
      type: "purchase",
      date: Date.now(),
      amount: invoice.total,
      description: { invoice: invoice._id },
    };
    clientDocument.transactions.push(transaction);
    clientDocument.debt += invoice.total;
    await db.clients.updatePro(
      { _id: clientDocument._id },
      { ...clientDocument }
    );

    // update previous client
    invoiceClient.debt -= invoice.total;
    invoiceClient.transactions = invoiceClient.transactions.filter(
      (trans) => trans.description?.invoice !== invoice._id
    );
    await db.clients.updatePro(
      { _id: invoiceClient._id },
      { ...invoiceClient }
    );

    invoice.client = clientDocument._id;
    invoiceClient = clientDocument;
  }

  invoice.title = req.body.title;
  invoice.rows = req.body.rows;
  invoice.total = req.body.total;
  invoice.invoiceDate = req.body.invoiceDate;

  let updateResponse = await db.invoices.updatePro(
    { _id: invoice._id },
    invoice,
    {
      returnUpdatedDocs: true,
    }
  );
  invoice = updateResponse[1];
  invoice.client = { name: invoiceClient.name, _id: invoiceClient._id };
  res.json(invoice);
};

exports.getInvoice = (req, res) => {
  const { invoice } = req;
  if (req.headers["content-type"] === "application/json") {
    res.status(200).json(invoice);
  }
  const html = new InvoiceHTML(
    path.join(__dirname, "../assets/template-invoice.html")
  )
    .fromInvoiceDocument(invoice)
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
      (t) => t.invoice !== invoiceDocument._id
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
