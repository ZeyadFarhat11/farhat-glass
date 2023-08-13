const Client = require("../models/clientModel");
const Invoice = require("../models/invoiceModel");
const catchAsync = require("../utils/catchAsync");

const OFFER_PRICE_ID = "64c9881cc7fd028354656523";

exports.getHomeStats = catchAsync(async (req, res) => {
  const clients = await Client.find().select("debt");
  const invoicesCount = await Invoice.find({
    client: { $ne: OFFER_PRICE_ID },
  }).countDocuments();
  const offerPriceInvoicesCount = await Invoice.find({
    client: OFFER_PRICE_ID,
  }).countDocuments();

  const remainingDebt = clients
    .filter((c) => c._id.toString() !== OFFER_PRICE_ID)
    .map((c) => c.debt)
    .reduce((a, b) => a + b, 0);
  res.json({
    clientsCount: clients.length - 1,
    invoicesCount,
    offerPriceInvoicesCount,
    remainingDebt,
  });
});

exports.getSuggestions = catchAsync(async (req, res) => {
  // const clients = await Client.find().select("name").lean();
  // const clientNames = clients.map((c) => c.name);
  res.json({
    qtyUnits: ["م", "م²", "قطعة", "عود", "ايام عمل", "عبوة", ""],
    // clientNames: clientNames,
    titles: [
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
    ],
  });
});
