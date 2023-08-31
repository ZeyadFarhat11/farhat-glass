const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
const Client = require("../models/clientModel");
const Work = require("../models/workModel");

const isValidClientId = async (id, { req }) => {
  const clientDocument = await Client.findById(id);
  if (!clientDocument) throw new Error();
  req.clientDocument = clientDocument;
};
const isValidWorkId = async (id, { req }) => {
  const workDocument = await Work.findById(id);
  if (!workDocument) throw new Error();
  req.workDocument = workDocument;
};

const InvalidClientMsg = "Invalid Client Id";

exports.validateCreateWork = [
  body("client", InvalidClientMsg).custom(isValidClientId),
  body("title").isString(),
  body("expectedWorkDays").optional().isNumeric(),
  checkValidationErrors,
];

exports.validateDeleteWork = [
  param("id").custom(isValidWorkId),
  checkValidationErrors,
];
