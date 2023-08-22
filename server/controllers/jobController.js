const Job = require("../models/jobModel");
const catchAsync = require("../utils/catchAsync");

exports.createJob = catchAsync(async (req, res) => {
  const jobDocument = await Job.create(req.body);

  res.status(200).json(jobDocument);
});

exports.deleteAllJobs = catchAsync(async () => {
  await Job.deleteMany({});
  res.sendStatus(200);
});

exports.getAllJobs = catchAsync(async (req, res) => {
  const jobs = await Job.find({});
  res.json({ length: jobs.length, jobs });
});

exports.deleteJob = catchAsync(async (req, res) => {
  await req.jobDocument.deleteOne();
  res.sendStatus(200);
});
