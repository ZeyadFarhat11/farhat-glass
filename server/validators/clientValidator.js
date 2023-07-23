const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
// const mongoose = require("mongoose");
const Client = require("../models/clientModel");

exports.validateMakeTransaction = [
  body("client").custom(async (client, { req }) => {
    const clientDocument = await Client.findById(client);
    if (!clientDocument) throw new Error("Invalid client id");
    req.clientDocument = clientDocument;
  }),
  body("amount").isNumeric(),
  body("date").optional().isDate(),
  body("operation").isIn(["pay", "purchase"]),
  body("title").optional().isString(),
  checkValidationErrors,
];

exports.validateDeleteClient = [
  param("id").custom(async (id, { req }) => {
    const clientDocument = await Client.findById(id);
    if (!clientDocument) throw new Error("Invalid client id");
    req.clientDocument = clientDocument;
  }),
  checkValidationErrors,
];
exports.validateGetClient = exports.validateDeleteClient;

exports.validateCreateClient = [
  body("name")
    .isString()
    .custom(async (name) => {
      const clientDocumentCheck = await Client.findOne({ name });
      if (clientDocumentCheck) throw new Error("Duplicated client name");
    }),
  body("debt").optional().isNumeric(),
  checkValidationErrors,
];

exports.validateUpdateClient = [
  param("id").custom(async (id, { req }) => {
    const clientDocument = await Client.findById(id);
    if (!clientDocument) throw new Error("Invalid client id");
    req.clientDocument = clientDocument;
  }),
  body("name")
    .isString()
    .custom(async (name, { req }) => {
      const clientDocumentCheck = await Client.findOne({
        name,
        _id: { $ne: req.params.id },
      });
      if (clientDocumentCheck) throw new Error("Duplicated client name");
    }),

  checkValidationErrors,
];
