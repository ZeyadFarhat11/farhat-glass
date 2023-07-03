const path = require("path");
const catchAsync = require("../utils/catchAsync");
const Invoice = require("../models/invoiceModel");
const InvoiceHTML = require("../utils/Invoice");

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
  let { rows, date, invoiceTotal } = req.body;
  let { client } = req;

  const invoiceDateMS = date || Date.now();
  invoiceTotal = invoiceTotal || calcInvoiceTotal(rows);

  const transaction = {
    type: "purchase",
    date: invoiceDateMS,
    amount: invoiceTotal,
    description: makeInvoiceTransactionDescription(rows),
  };

  client.transactions.push(transaction);
  client.debt += invoiceTotal;
  await client.save();

  console.log(client);

  const invoiceDocument = await Invoice.create({
    client: client.id,
    invoiceDate: invoiceDateMS,
    invoiceTotal,
    rows,
  });

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
