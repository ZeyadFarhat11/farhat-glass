const catchAsync = require("../utils/catchAsync");

exports.getHomeStats = (_, res) => {
  res.json({
    clientsCount: process.clientsCount,
    vendorsCount: process.vendorsCount,
    ourDebt: process.ourDebt,
    invoicesCount: process.invoicesCount,
    offerPriceInvoicesCount: process.offerPriceInvoicesCount,
    remainingDebt: process.remainingDebt,
  });
};

exports.getSuggestions = catchAsync(async (req, res) => {
  res.json({
    qtyUnits: ["م", "م²", "قطعة", "عود", "ايام عمل", "عبوة"],
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
