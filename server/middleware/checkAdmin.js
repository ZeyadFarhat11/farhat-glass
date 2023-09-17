const httpStatus = require("http-status-codes");

const { SECONDARY_ADMIN_TOKEN, MAIN_ADMIN_TOKEN, TEST_TOKEN } = process.env;
const admins = [SECONDARY_ADMIN_TOKEN, MAIN_ADMIN_TOKEN, TEST_TOKEN];

module.exports = (req, res, next) => {
  const token = req.body.token || req.headers.token;
  if (admins.includes(token)) return next();

  res.sendStatus(httpStatus.StatusCodes.UNAUTHORIZED);
};
