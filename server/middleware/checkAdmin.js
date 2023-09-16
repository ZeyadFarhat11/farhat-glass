const httpStatus = require("http-status-codes");

const { ROSHDY_TOKEN, ZEYAD_TOKEN, TEST_TOKEN } = process.env;
const admins = [ROSHDY_TOKEN, ZEYAD_TOKEN, TEST_TOKEN];

module.exports = (req, res, next) => {
  const token = req.body.token || req.headers.token;
  if (admins.includes(token)) return next();

  res.sendStatus(httpStatus.StatusCodes.UNAUTHORIZED);
};
