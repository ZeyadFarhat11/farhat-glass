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
