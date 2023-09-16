const { Router } = require("express");
const c = require("../controllers/messageController");
const v = require("../validators/messageValidator");
const checkConfirmationCode = require("../middleware/checkConfirmationCode");
const checkAdmin = require("../middleware/checkAdmin");
const router = Router();

router
  .route("/messages")
  .post(v.validateCreateMessage, c.createMessage)
  .get(checkAdmin, c.listMessages)
  .delete(checkAdmin, checkConfirmationCode, c.deleteAllMessages);

router
  .route("/message/:id")
  .get(checkAdmin, v.validateGetMessage, c.getMessage)
  .delete(checkAdmin, c.deleteMessage);

module.exports = router;
