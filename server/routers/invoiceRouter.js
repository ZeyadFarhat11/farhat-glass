const { Router } = require("express");
const invoiceController = require("../controllers/invoiceController");
const invoiceValidator = require("../validators/invoiceValidator");
const router = Router();

router.post(
  "/",
  invoiceValidator.validateCreateInvoice,
  invoiceController.createInvoice
);
router.get("/", invoiceController.getAllInvoices);
router.get("/suggestions", invoiceController.getInvoiceRowTitleSuggestions);
router.get("/quantity-units", invoiceController.getInvoiceQtyUnits);
router.get(
  "/:id",
  invoiceValidator.validateGetInvoice,
  invoiceController.getInvoice
);
router.delete(
  "/:id",
  invoiceValidator.validateDeleteInvoice,
  invoiceController.deleteInvoice
);
module.exports = router;
