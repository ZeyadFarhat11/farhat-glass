const { Router } = require("express");
const clientController = require("../controllers/clientController");
const clientValidator = require("../validators/clientValidator");
const checkConfirmationCode = require("../middleware/checkConfirmationCode");
const router = Router();

// router.post(
//   "/transactions",
//   clientValidator.validateMakeTransaction,
//   clientController.makeTransaction
// );
router
  .route("/:id")
  .delete(clientValidator.validateDeleteClient, clientController.deleteClient)
  .get(clientValidator.validateGetClient, clientController.getClient)
  .patch(clientValidator.validateUpdateClient, clientController.updateClient);

router
  .route("/")
  .delete(checkConfirmationCode, clientController.deleteAllClients)
  .get(clientController.getAllClients)
  .post(clientValidator.validateCreateClient, clientController.createClient);

router.delete(
  "/:clientId/transactions/:transactionId",
  clientValidator.validateDeleteTransaction,
  clientController.deleteTransaction
);

module.exports = router;
