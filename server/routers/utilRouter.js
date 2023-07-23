const { Router } = require("express");
const utilController = require("../controllers/utilController");
const router = Router();

router.use("/home", utilController.getHomeStats);
router.use("/suggestions", utilController.getSuggestions);

module.exports = router;
