const Message = require("../models/messageModel");
const { createOne, deleteAll, deleteOne, list, getOne } = require("./factory");

exports.listMessages = list(Message);
exports.getMessage = getOne(Message, {
  fromReq: true,
  reqField: "messageDocument",
});
exports.createMessage = createOne(Message);
exports.deleteAllMessages = deleteAll(Message);
exports.deleteMessage = deleteOne(Message);
