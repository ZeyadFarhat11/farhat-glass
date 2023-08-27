const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
const Invoice = require("../models/invoiceModel");
const Client = require("../models/clientModel");

exports.validateCreateInvoice = [
  body("rows").isArray({ min: 1 }),
  body("client")
    .optional()
    .custom(async (client, { req }) => {
      const clientDocument = await Client.findById(client);
      if (!clientDocument) throw new Error("Invalid client id");
      req.clientDocument = clientDocument;
    }),
  body("title").optional().isString(),
  body("priceOffer").optional().isBoolean(),
  checkValidationErrors,
];

const WRONG_ID = "Invalid invoice id";

exports.validateUpdateInvoice = [
  param("id").custom(async (id, { req }) => {
    const invoiceDocument = await Invoice.findById(id).populate("client");
    if (!invoiceDocument) throw new Error(WRONG_ID);
    req.invoiceDocument = invoiceDocument;
  }),
  body("rows").isArray({ min: 1 }),
  body("client")
    .isString()
    .custom(async (id, { req }) => {
      if (!id) return;
      const clientDocument = await Client.findById(id);
      if (!clientDocument) throw new Error("Invalid client id");
      req.clientDocument = clientDocument;
    }),
  body("date").isString(),
  body("title").exists(),
  body("priceOffer").isBoolean(),
  checkValidationErrors,
];

exports.validateGetInvoice = [
  param("id").custom(async (id, { req }) => {
    const invoiceDocument = await Invoice.findById(id).populate(
      "client",
      "name"
    );

    if (!invoiceDocument) throw new Error(WRONG_ID);

    req.invoiceDocument = invoiceDocument;
  }),
  checkValidationErrors,
];

exports.validateDeleteInvoice = [
  param("id").custom(async (id, { req }) => {
    const invoiceDocument = await Invoice.findById(id);
    if (!invoiceDocument) throw new Error(WRONG_ID);
    req.invoiceDocument = invoiceDocument;
  }),
  checkValidationErrors,
];
