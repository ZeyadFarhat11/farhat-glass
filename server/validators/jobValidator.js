const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
const Invoice = require("../models/invoiceModel");
const Client = require("../models/clientModel");
const Job = require("../models/jobModel");

const isValidClientId = async (id, { req }) => {
  const clientDocument = await Client.findById(id);
  if (!clientDocument) throw new Error();
  req.clientDocument = clientDocument;
};
const isValidJobId = async (id, { req }) => {
  const jobDocument = await Job.findById(id);
  if (!jobDocument) throw new Error();
  req.jobDocument = jobDocument;
};

const InvalidClientMsg = "Invalid Client Id";

exports.validateCreateJob = [
  body("client", InvalidClientMsg).custom(isValidClientId),
  body("title").isString(),
  body("expectedWorkDays").optional().isNumeric(),
  checkValidationErrors,
];

exports.validateDeleteJob = [
  param("id").custom(isValidJobId),
  checkValidationErrors,
];
