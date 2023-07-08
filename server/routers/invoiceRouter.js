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
router.get(
  "/:id",
  invoiceValidator.validateGetInvoice,
  invoiceController.getInvoice
);

module.exports = router;
