const { Router } = require("express");
const invoiceController = require("../controllers/invoiceController");

const router = Router();

router.post("/", invoiceController.createInvoice);
router.get("/:path", invoiceController.getInvoice);

module.exports = router;
