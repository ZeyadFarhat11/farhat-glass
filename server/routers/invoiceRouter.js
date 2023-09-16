const { Router } = require("express");
const invoiceController = require("../controllers/invoiceController");
const invoiceValidator = require("../validators/invoiceValidator");
const checkConfirmationCode = require("../middleware/checkConfirmationCode");
const router = Router();

router
  .route("/invoices")
  .post(invoiceValidator.validateCreateInvoice, invoiceController.createInvoice)
  .get(invoiceController.getAllInvoices)
  .delete(checkConfirmationCode, invoiceController.deleteAllInvoices);

router
  .route("/invoices/:id")
  .get(invoiceValidator.validateGetInvoice, invoiceController.getInvoice)
  .delete(
    invoiceValidator.validateDeleteInvoice,
    invoiceController.deleteInvoice
  )
  .put(invoiceValidator.validateUpdateInvoice, invoiceController.updateInvoice);

module.exports = router;
