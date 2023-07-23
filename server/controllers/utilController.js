const Client = require("../models/clientModel");
const Invoice = require("../models/invoiceModel");
const catchAsync = require("../utils/catchAsync");

exports.getHomeStats = catchAsync(async (req, res) => {
  const clients = await Client.find().select("debt");
  const invoicesCount = await Invoice.countDocuments();

  const remainingDebt = clients.map((c) => c.debt).reduce((a, b) => a + b, 0);
  res.json({
    clientsCount: clients.length,
    invoicesCount,
    remainingDebt,
  });
});

exports.getSuggestions = catchAsync(async (req, res) => {
  // const clients = await Client.find().select("name").lean();
  // const clientNames = clients.map((c) => c.name);
  res.json({
    qtyUnits: ["م", "م²", "قطعة", "عود"],
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
