const { Router } = require("express");
const utilController = require("../controllers/utilController");
const checkAdmin = require("../middleware/checkAdmin");
const router = Router();

router.post("/auth/login", utilController.login);

router.get("/dashboard", checkAdmin, utilController.getHomeStats);
router.get("/suggestions", checkAdmin, utilController.getSuggestions);

module.exports = router;
