const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
// const mongoose = require("mongoose");
const Client = require("../models/clientModel");
const checkValidClientId = async (clientId, { req }) => {
  const clientDocument = await Client.findById(clientId);
  if (!clientDocument) throw new Error("Invalid client id");
  req.clientDocument = clientDocument;
};

exports.validateMakeTransaction = [
  body("client").custom(checkValidClientId),
  body("amount").isNumeric(),
  body("date").optional().isDate(),
  body("operation").isIn(["pay", "purchase"]),
  body("title").optional().isString(),
  checkValidationErrors,
];

exports.validateDeleteClient = [
  param("id").custom(checkValidClientId),
  checkValidationErrors,
];
exports.validateGetClient = exports.validateDeleteClient;

exports.validateDeleteTransaction = [
  param("clientId").custom(checkValidClientId),
  param("transactionId").custom(async (transactionId, { req }) => {
    const transaction = req.clientDocument.transactions.find(
      (t) => String(t._id) === transactionId
    );
    if (!transaction) throw new Error("Invalid transaction id");
    req.transaction = transaction;
  }),
  checkValidationErrors,
];

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
  param("id").custom(checkValidClientId),
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
