const path = require("path");
const catchAsync = require("../utils/catchAsync");
// const Invoice = require("../models/invoiceModel");
const InvoiceHTML = require("../utils/Invoice");
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
    date: Date.now(),
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
    "زجاج سيكوريت 10مل شفاف",
    "اكسسوار",
    "مصنعية",
    "مسطرة مستورد",
    "طقم باب سيكوريت",
    "ماكينة باب سيكوريت",
    "مقبض باب سيكوريت",
    "مساطر وزوايا",
    "F حرف الومونيوم",
    "U حرف الومونيوم",
    "قطاع",
    "كفر قطاع",
  ]);
};
exports.getInvoiceQtyUnits = (_, res) => {
  res.json(["م", "م²", "قطعة", "عود"]);
};
