const { Router } = require("express");
const jobController = require("../controllers/jobController");
const jobValidator = require("../validators/jobValidator");
const checkConfirmationCode = require("../middleware/checkConfirmationCode");
const router = Router();

router.post("/job", jobValidator.validateCreateJob, jobController.createJob);
router.delete("/jobs", checkConfirmationCode, jobController.deleteAllJobs);
router.get("/jobs", jobController.getAllJobs);
router.delete(
  "/job/:id",
  jobValidator.validateDeleteJob,
  jobController.deleteJob
);

module.exports = router;
