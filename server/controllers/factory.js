const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status-codes");

exports.createOne = (Model, { allowedFields, disallowedFields } = {}) =>
  catchAsync(async (req, res) => {
    let data = req.body;

    if (allowedFields) {
      data = {};
      for (let key in req.body) {
        if (allowedFields.includes(key)) data[key] = req.body[key];
      }
    }
    if (disallowedFields) {
      data = {};
      for (let key in req.body) {
        if (!disallowedFields.includes(key)) data[key] = req.body[key];
      }
    }

    const document = await Model.create(data);
    res.status(httpStatus.StatusCodes.CREATED).json(document);
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);
    res.sendStatus(httpStatus.StatusCodes.NO_CONTENT);
  });

exports.deleteAll = (Model) =>
  catchAsync(async (_, res) => {
    await Model.deleteMany({});
    res.sendStatus(httpStatus.StatusCodes.NO_CONTENT);
  });

exports.updateOne = (
  Model,
  { allowedFields, disallowedFields, updateOptions } = {}
) =>
  catchAsync(async (req, res) => {
    let data = req.body;

    if (allowedFields) {
      data = {};
      for (let key in req.body) {
        if (allowedFields.includes(key)) data[key] = req.body[key];
      }
    }
    if (disallowedFields) {
      data = {};
      for (let key in req.body) {
        if (!disallowedFields.includes(key)) data[key] = req.body[key];
      }
    }

    await Model.findByIdAndUpdate(req.params.id, data, updateOptions);
    res.sendStatus(httpStatus.StatusCodes.OK);
  });

exports.list = (Model, { withLength } = {}) =>
  catchAsync(async (req, res) => {
    const docs = await Model.find({});
    res.json(withLength ? { results: docs.length, docs } : docs);
  });

exports.getOne = (Model, { fromReq = false, reqField = "" } = {}) =>
  catchAsync(async (req, res) => {
    if (fromReq) return res.json(req[reqField]);
    const doc = await Model.findById(req.params.id);
    res.json(doc);
  });
