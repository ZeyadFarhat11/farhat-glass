const { Router } = require("express");
const utilController = require("../controllers/utilController");
const router = Router();

router.use("/dashboard", utilController.getHomeStats);
router.use("/suggestions", utilController.getSuggestions);

module.exports = router;
