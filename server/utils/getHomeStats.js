const Client = require("../models/clientModel");
const Invoice = require("../models/invoiceModel");

async function getHomeStats() {
  const normalClientsPromise = Client.find({ vendor: { $ne: true } }).select(
    "debt"
  );
  const invoicesCountPromise = Invoice.find({
    priceOffer: { $ne: true },
  }).countDocuments();

  const offerPriceInvoicesCountPromise = Invoice.find({
    priceOffer: true,
  }).countDocuments();

  const vendorsPromise = Client.find({ vendor: true }).select("debt");

  const normalClients = await normalClientsPromise;
  const remainingDebt = normalClients
    .map((c) => c.debt)
    .reduce((a, b) => a + b, 0);

  const vendors = await vendorsPromise;
  const ourDebt = vendors.map((c) => c.debt).reduce((a, b) => a + b, 0);

  const invoicesCount = await invoicesCountPromise;

  const offerPriceInvoicesCount = await offerPriceInvoicesCountPromise;

  return {
    clientsCount: normalClients.length,
    vendorsCount: vendors.length,
    invoicesCount,
    offerPriceInvoicesCount,
    ourDebt: ourDebt.toLocaleString("en-US"),
    remainingDebt: remainingDebt.toLocaleString("en-US"),
  };
}

module.exports = getHomeStats;
