const { Router } = require("express");
const clientController = require("../controllers/clientController");
const clientValidator = require("../validators/clientValidator");
const router = Router();

router.post("/", clientController.createClient);
router.post(
  "/transactions",
  clientValidator.validateMakeTransaction,
  clientController.makeTransaction
);
router.get("/:name", clientController.getClient);

module.exports = router;
