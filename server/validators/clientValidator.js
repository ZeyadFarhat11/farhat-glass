const { body } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
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
