const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
const Message = require("../models/messageModel");
const validator = require("validator").default;

const checkPhoneNumber = (val) => {
  const pattern = /^01\d{9}$/;
  if (!pattern.test(val)) throw new Error("رقم هاتف غير صالح!");
  return true;
};
const checkEmail = (val) => {
  if (!validator.isEmail(val)) throw new Error("بريد الكتروني غير صالح!");
  return true;
};

const checkValidMessageId = async (id, { req }) => {
  const messageDocument = await Message.findById(id);
  if (!messageDocument) throw new Error("Unvalid message id");
  req.messageDocument = messageDocument;
};

exports.validateCreateMessage = [
  body("name", "يرجي كتابة اسمك الثنائي")
    .isString()
    .isLength({ min: 3, max: 32 }),
  body("phone").custom(checkPhoneNumber),
  body("email").custom(checkEmail),
  body("message", "يرجي كتابة رسالة بحد اقصي 1000 حرف")
    .isString()
    .isLength({ min: 3, max: 1000 }),
  checkValidationErrors,
];

exports.validateGetMessage = [
  param("id").custom(checkValidMessageId),
  checkValidationErrors,
];
