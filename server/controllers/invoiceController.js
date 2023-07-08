const path = require("path");
const catchAsync = require("../utils/catchAsync");
const Invoice = require("../models/invoiceModel");
const InvoiceHTML = require("../utils/Invoice");
const Client = require("../models/clientModel");
const db = require("../DB/db");

const calcInvoiceTotal = (rows) =>
  rows.map((row) => +row.at(-1)).reduce((a, b) => a + b, 0);

const makeInvoiceTransactionDescription = (rows) => {
  let description = "";
  rows.forEach((row, i) => {
    description += `الصنف: ${row[0]}\n`;
    description += `الكمية: ${row[1]}\n`;
    description += `السعر: ${row[2]}\n`;
    description += `الاجمالي: ${row[3]}\n`;
    if (i !== rows.length - 1) {
      description += "-".repeat(20) + "\n";
    }
  });
  return description;
};

exports.createInvoice = catchAsync(async (req, res) => {
  let { rows, date, invoiceTotal, client } = req.body;

  let clientDocument = await db.clients.findOnePro({ name: client });
  let currentTime = Date.now();
  if (!clientDocument)
    clientDocument = await db.clients.insertPro({
      name: client,
      debt: 0,
      transactions: [],
      createdAt: currentTime,
      updatedAt: currentTime,
    });
  console.log(clientDocument);
  // let clientDocument = await Client.findOne({ name: client });
  // if (!clientDocument) clientDocument = await Client.create({ name: client });

  const invoiceDateMS = date || Date.now();
  invoiceTotal = invoiceTotal || calcInvoiceTotal(rows);

  const invoiceDocument = await db.invoices.insertPro({
    client: clientDocument._id,
    invoiceDate: invoiceDateMS,
    rows,
    invoiceTotal,
    createdAt: currentTime,
    updatedAt: currentTime,
  });

  const transaction = {
    type: "purchase",
    date: invoiceDateMS,
    amount: invoiceTotal,
    description: { invoice: invoiceDocument._id },
  };

  const [, clientDocumentUpdated] = await db.clients.updatePro(
    { _id: clientDocument._id },
    {
      $push: { transactions: transaction },
      $set: { debt: clientDocument.debt + invoiceTotal, updatedAt: Date.now() },
    },
    { returnUpdatedDocs: true }
  );
  // clientDocument.transactions.push(transaction);
  // clientDocument.debt += invoiceTotal;
  // await clientDocument.save();

  // const invoiceDocument = await Invoice.create({
  //   client: clientDocument.id,
  //   invoiceDate: invoiceDateMS,
  //   invoiceTotal,
  //   rows,
  // });

  res.status(200).json(invoiceDocument);
});

exports.getInvoice = (req, res) => {
  const { invoice } = req;
  const html = new InvoiceHTML(
    path.join(__dirname, "../assets/template-invoice.html")
  )
    .fromInvoiceDocument(invoice)
    .getHTML();

  res.status(200).send(html);
};

exports.getAllInvoices = async (req, res) => {
  const docs = await db.invoices.findPro({});
  res.json(docs);
};
