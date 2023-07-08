const { Router } = require("express");
const clientController = require("../controllers/clientController");
const clientValidator = require("../validators/clientValidator");
const router = Router();

router.post(
  "/",
  clientValidator.validateCreateClient,
  clientController.createClient
);
router.post(
  "/transactions",
  clientValidator.validateMakeTransaction,
  clientController.makeTransaction
);
router.delete(
  "/:id",
  clientValidator.validateDeleteClient,
  clientController.deleteClient
);
router.get("/", clientController.getAllClients);
router.get(
  "/:id",
  clientValidator.validateGetClient,
  clientController.getClient
);
router.patch(
  "/:id",
  clientValidator.validateUpdateClient,
  clientController.updateClient
);

module.exports = router;
