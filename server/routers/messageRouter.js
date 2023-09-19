const { Router } = require("express");
const c = require("../controllers/messageController");
const v = require("../validators/messageValidator");
const checkConfirmationCode = require("../middleware/checkConfirmationCode");
const checkAdmin = require("../middleware/checkAdmin");
const router = Router();

router.post("/message", v.validateCreateMessage, c.createMessage);

router
  .route("/messages")
  .get(checkAdmin, c.listMessages)
  .delete(checkAdmin, checkConfirmationCode, c.deleteAllMessages);

router
  .route("/message/:id")
  .get(checkAdmin, v.validateGetMessage, c.getMessage)
  .delete(checkAdmin, checkConfirmationCode, c.deleteMessage);

module.exports = router;
