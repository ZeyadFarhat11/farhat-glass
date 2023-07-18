const path = require("path");
const catchAsync = require("../utils/catchAsync");
// const Invoice = require("../models/invoiceModel");
const InvoiceHTML = require("../utils/Invoice");
// const Client = require("../models/clientModel");
const db = require("../DB/db");

const calcInvoiceTotal = (rows) =>
  rows.map((row) => +row.at(-1)).reduce((a, b) => a + b, 0);

exports.createInvoice = catchAsync(async (req, res) => {
  let { rows, date, total, client, title } = req.body;

  let clientDocument = await db.clients.findOnePro({ name: client });
  let currentTime = Date.now();
  if (!clientDocument && client)
    clientDocument = await db.clients.insertPro({
      name: client,
      debt: 0,
      transactions: [],
      createdAt: currentTime,
      updatedAt: currentTime,
    });
  // let clientDocument = await Client.findOne({ name: client });
  // if (!clientDocument) clientDocument = await Client.create({ name: client });

  const invoiceDateMS = date || Date.now();
  total = total || calcInvoiceTotal(rows);
  currentTime = Date.now();

  const invoiceDocument = await db.invoices.insertPro({
    client: clientDocument?._id,
    invoiceDate: invoiceDateMS,
    rows,
    total,
    title,
    createdAt: currentTime,
    updatedAt: currentTime,
  });

  const transaction = {
    type: "purchase",
    date: invoiceDateMS,
    amount: total,
    description: { invoice: invoiceDocument._id },
  };

  if (clientDocument) {
    await db.clients.updatePro(
      { _id: clientDocument._id },
      {
        $push: { transactions: transaction },
        $set: {
          debt: clientDocument.debt || 0 + +total,
          updatedAt: Date.now(),
        },
      },
      { returnUpdatedDocs: true }
    );
  }
  // clientDocument.transactions.push(transaction);
  // clientDocument.debt += total;
  // await clientDocument.save();

  // const invoiceDocument = await Invoice.create({
  //   client: clientDocument.id,
  //   invoiceDate: invoiceDateMS,
  //   total,
  //   rows,
  // });

  const invoiceUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}/${
    invoiceDocument._id
  }`;
  res.status(200).json({
    ...invoiceDocument,
    url: invoiceUrl,
  });
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

exports.getAllInvoices = catchAsync(async (req, res) => {
  let docs = await db.invoices.findPro({});
  for (let i = 0; i < docs.length; i++) {
    const clientDocument = await db.clients.findOnePro({ _id: docs[i].client });
    docs[i] = {
      ...docs[i],
      client: clientDocument
        ? { _id: clientDocument._id, name: clientDocument.name }
        : undefined,
      rowsCount: docs[i].rows.length,
    };
  }
  docs = docs.filter((e) => e);
  res.json(docs);
});

exports.deleteInvoice = catchAsync(async (req, res) => {
  const invoiceDocument = req.invoice;
  let clientDocument = await db.clients.findOnePro({
    _id: invoiceDocument.client,
  });
  if (clientDocument) {
    clientDocument.transactions = clientDocument.transactions.filter(
      (t) => t.description.invoice !== invoiceDocument._id
    );
    clientDocument.debt -= invoiceDocument.invoiceTotal;
    await db.clients.updatePro(
      { _id: invoiceDocument.client },
      { ...clientDocument, updatedAt: Date.now() }
    );
  }
  await db.invoices.deletePro({ _id: req.params.id });
  res.sendStatus(200);
});

exports.getInvoiceRowTitleSuggestions = (_, res) => {
  res.json([
    "زجاج سيكوريت 10مل ابيض",
    "اكسسوار",
    "مصنعية",
    "مسطرة مستورد",
    "طقم باب سيكوريت",
    "ماكينة باب سيكوريت",
    "مقبض باب سيكوريت",
    "مساطر وزوايا",
    "حرف الومونيوم",
  ]);
};
