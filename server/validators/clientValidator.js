const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
const db = require("../DB/db");
// const mongoose = require("mongoose");
// const Client = require("../models/clientModel");

exports.validateMakeTransaction = [
  body("client").isString(),
  body("amount").isNumeric(),
  body("date").optional().isDate(),
  body("operation").isIn(["pay", "purchase"]),
  body("title").optional().isString(),
  checkValidationErrors,
];

exports.validateDeleteClient = [
  param("id", "معرف عميل غير صالح").custom(async (clientID, { req }) => {
    const clientDocument = await db.clients.findOnePro({ _id: clientID });
    // const clientDocument = await Client.findById(clientID);
    if (!clientDocument) throw new Error("معرف عميل غير صالح");
    req.client = clientDocument;
  }),
  checkValidationErrors,
];
exports.validateGetClient = exports.validateDeleteClient;
exports.validateCreateClient = [
  body("name")
    .isString()
    .custom(async (name) => {
      const clientDocumentCheck = await db.clients.findOnePro({ name });
      // const clientDocumentCheck = await Client.findOne({ name });
      if (clientDocumentCheck) throw new Error("اسم عميل مكرر");
    }),
  checkValidationErrors,
];

exports.validateUpdateClient = [
  param("id", "معرف عميل غير صالح").custom(async (clientID, { req }) => {
    const clientDocument = await db.clients.findOnePro({ _id: clientID });
    // const clientDocument = await Client.findById(clientID);
    if (!clientDocument) throw new Error("معرف عميل غير صالح");
    req.client = clientDocument;
  }),
  body("name")
    .isString()
    .custom(async (name, { req }) => {
      const clientDocumentCheck = await db.clients.findOnePro({
        name,
        _id: { $ne: req.params.id },
      });
      // const clientDocumentCheck = await Client.findOne({
      //   name,
      //   _id: { $ne: req.params.id },
      // });
      if (clientDocumentCheck) throw new Error("اسم عميل مكرر");
    }),

  checkValidationErrors,
];
