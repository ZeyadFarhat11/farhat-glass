const Work = require("../models/workModel");
const catchAsync = require("../utils/catchAsync");
const { createOne, deleteAll } = require("./factory");

exports.createWork = createOne(Work);

exports.deleteAllWorks = deleteAll(Work);

exports.getAllWorks = catchAsync(async (req, res) => {
  const works = await Work.find({}).populate("client", "name");
  res.json({ length: works.length, works });
});

exports.deleteWork = catchAsync(async (req, res) => {
  await req.workDocument.deleteOne();
  res.sendStatus(200);
});
