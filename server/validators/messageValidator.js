const { body, param } = require("express-validator");
const checkValidationErrors = require("../middleware/checkValidationErrors");
const Message = require("../models/messageModel");

const checkPhoneNumber = (val) => {
  throw new Error();
};
const checkEmail = (val) => {
  throw new Error();
};

const checkValidMessageId = async (id, { req }) => {
  const messageDocument = await Message.findById(id);
  if (!messageDocument) throw new Error("Unvalid message id");
  req.messageDocument = messageDocument;
};

exports.validateCreateMessage = [
  body("name").isString().isLength({ min: 3, max: 32 }),
  body("phone").isString().custom(checkPhoneNumber),
  body("email").isString().custom(checkEmail),
  body("message").isString().isLength({ min: 3, max: 1000 }),
  checkValidationErrors,
];

exports.validateGetMessage = [
  param("id").custom(checkValidMessageId),
  checkValidationErrors,
];
