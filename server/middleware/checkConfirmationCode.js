const httpStatus = require("http-status-codes");
module.exports = (req, res, next) => {
  const confirmation = req.body.confirmation || req.headers.confirmation;
  if (confirmation !== process.env.CONFIRMATION_CODE) {
    return res
      .status(httpStatus.StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid confirmation code" });
  }
  next();
};
