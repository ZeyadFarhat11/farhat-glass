const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
const Client = require("../models/clientModel");
const { default: mongoose } = require("mongoose");
const Invoice = require("../models/invoiceModel");
const db = require("../DB/db");

exports.validateCreateInvoice = [
  body("rows").isArray({ min: 1 }),
  body("client").optional().isString(),
  body("date").optional().isDate(),
  body("invoiceTotal").optional().isNumeric(),
  checkValidationErrors,
];

exports.validateGetInvoice = [
  param("id").custom(async (id, { req }) => {
    const invoiceDocument = await db.invoices.findOnePro({ _id: id });
    // const invoiceDocument = await Invoice.findById(id);

    if (!invoiceDocument) throw new Error("معرف فاتورة خاطئ");

    let clientDocument = await db.clients.findOnePro({
      _id: invoiceDocument.client,
    });
    req.invoice = {
      ...invoiceDocument,
      client: { name: clientDocument?.name, _id: clientDocument._id },
    };
    // req.invoice = await invoiceDocument.populate("client", { name: 1 });
  }),
  checkValidationErrors,
];
