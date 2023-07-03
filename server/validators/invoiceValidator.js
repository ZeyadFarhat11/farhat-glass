const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
const Client = require("../models/clientModel");
const { default: mongoose } = require("mongoose");
const Invoice = require("../models/invoiceModel");

exports.validateCreateInvoice = [
  body("rows").isArray({ min: 1 }),
  body("client")
    .optional()
    .isString()
    .bail()
    .custom(async (client, { req }) => {
      let clientDocument = await Client.findOne({ name: client });
      if (!clientDocument)
        clientDocument = await Client.create({ name: client });
      req.client = clientDocument;
    }),
  body("date").optional().isDate(),
  body("invoiceTotal").optional().isNumeric(),
  checkValidationErrors,
];

exports.validateGetInvoice = [
  param("id")
    .isString()
    .bail()
    .custom((e) => mongoose.isValidObjectId(e))
    .bail()
    .custom(async (id, { req }) => {
      const invoiceDocument = await Invoice.findById(id);

      if (!invoiceDocument) throw new Error("Invalid invoice id");
      req.invoice = await invoiceDocument.populate("client", { name: 1 });
    }),
  checkValidationErrors,
];
