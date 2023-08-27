const Job = require("../models/jobModel");
const catchAsync = require("../utils/catchAsync");
const { createOne } = require("./factory");

exports.createJob = createOne(Job);

exports.deleteAllJobs = catchAsync(async () => {
  await Job.deleteMany({});
  res.sendStatus(200);
});

exports.getAllJobs = catchAsync(async (req, res) => {
  const jobs = await Job.find({}).populate("client", "name");
  res.json({ length: jobs.length, jobs });
});

exports.deleteJob = catchAsync(async (req, res) => {
  await req.jobDocument.deleteOne();
  res.sendStatus(200);
});
