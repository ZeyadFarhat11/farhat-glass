const db = require("../DB/db");
// const Client = require("../models/clientModel");
const catchAsync = require("../utils/catchAsync");

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
  const { name } = req.body;
  const currentTime = Date.now();
  const clientDocument = await db.clients.insertPro({
    name,
    debt: 0,
    transactions: [],
    createdAt: currentTime,
    updatedAt: currentTime,
  });

  res.status(200).json(clientDocument);
});

exports.getClient = catchAsync(async (req, res) => {
  // res.cookie("cookie", "cookieValue", { maxAge: 5000000, httpOnly: true });
  res.status(200).json(req.client);
});

exports.updateClient = catchAsync(async (req, res) => {
  const { client } = req;
  db.clients.update(
    { _id: client._id },
    { name: req.body.name || client.name, updatedAt: Date.now() },
    { returnUpdatedDocs: true },
    (err, _, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err.message);
      }

      res.status(200).json(doc);
    }
  );
});
exports.deleteClient = catchAsync(async (req, res) => {
  // await req.client.deleteOne();
  await db.clients.deletePro({ _id: req.client._id });
  res.sendStatus(200);
});
exports.getAllClients = catchAsync(async (req, res) => {
  // const clients = await Client.find({}).select("-transactions -__v");
  const clients = await db.clients.findPro({});
  // console.log(clients);
  res
    .status(200)
    .json(
      clients.map((c) => ({ ...c, transactionsCount: c.transactions.length }))
    );
});
