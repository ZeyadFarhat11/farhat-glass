const { Router } = require("express");
const workController = require("../controllers/workController");
const workValidator = require("../validators/workValidator");
const checkConfirmationCode = require("../middleware/checkConfirmationCode");
const router = Router();

router.post(
  "/work",
  workValidator.validateCreateWork,
  workController.createWork
);
router.delete("/works", checkConfirmationCode, workController.deleteAllWorks);
router.get("/works", workController.getAllWorks);
router.delete(
  "/work/:id",
  workValidator.validateDeleteWork,
  workController.deleteWork
);

module.exports = router;
