const Client = require("../models/clientModel");
const Invoice = require("../models/invoiceModel");

async function setHomeStats() {
  const normalClients = await Client.find({ vendor: { $ne: true } }).select(
    "debt"
  );
  const remainingDebt = normalClients
    .map((c) => c.debt)
    .reduce((a, b) => a + b, 0);

  const vendors = await Client.find({ vendor: true }).select("debt");
  const ourDebt = vendors.map((c) => c.debt).reduce((a, b) => a + b, 0);

  const invoicesCount = await Invoice.find({
    priceOffer: { $ne: true },
  }).countDocuments();

  const offerPriceInvoicesCount = await Invoice.find({
    priceOffer: true,
  }).countDocuments();

  process.clientsCount = normalClients.length;
  process.vendorsCount = vendors.length;
  process.ourDebt = ourDebt;
  process.invoicesCount = invoicesCount;
  process.offerPriceInvoicesCount = offerPriceInvoicesCount;
  process.remainingDebt = remainingDebt;
}

module.exports = setHomeStats;
