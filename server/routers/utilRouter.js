const { Router } = require("express");
const utilController = require("../controllers/utilController");
const checkAdmin = require("../middleware/checkAdmin");
const router = Router();

router.get("/dashboard", checkAdmin, utilController.getHomeStats);
router.get("/suggestions", checkAdmin, utilController.getSuggestions);
router.post("/auth/login", utilController.login);
module.exports = router;
