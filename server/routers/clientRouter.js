const { Router } = require("express");
const clientController = require("../controllers/clientController");
const router = Router();

router.post("/", clientController.createClient);
router.post("/transaction", clientController.makeTransaction);
router.get("/:name", clientController.getClient);

module.exports = router;
