const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");

const Client = require("../models/clientModel");

const checkValidClientId = async (clientId, { req }) => {
  const clientDocument = await Client.findById(clientId);
  if (!clientDocument) throw new Error("Invalid client id");
  req.clientDocument = clientDocument;
};

const checkValidTransactionId = async (transactionId, { req }) => {
  const transaction = req.clientDocument.transactions.find(
    (t) => String(t._id) === transactionId
  );
  if (!transaction) throw new Error("Invalid transaction id");
  req.transaction = transaction;
};

exports.validateMakeTransaction = [
  param("clientId").custom(checkValidClientId),
  body("amount").isNumeric(),
  body("type").isIn(Client.TransactionTypes),
  checkValidationErrors,
];

exports.validateEditTransaction = [
  param("clientId").custom(checkValidClientId),
  param("transactionId").custom(checkValidTransactionId),
  body("amount").isNumeric(),
  body("type").isIn(Client.TransactionTypes),
  body("description").isString().isLength({ min: 3, max: 520 }),
];

exports.validateDeleteClient = [
  param("id").custom(checkValidClientId),
  checkValidationErrors,
];
exports.validateGetClient = exports.validateDeleteClient;

exports.validateDeleteTransaction = [
  param("clientId").custom(checkValidClientId),
  param("transactionId").custom(checkValidTransactionId),
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
  body("vendor").isBoolean(),
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
  body("vendor").isBoolean(),
  checkValidationErrors,
];
