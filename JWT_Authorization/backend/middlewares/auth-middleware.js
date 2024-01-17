const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/tokenService");
module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.Unauthorized());
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.Unauthorized());
    }
    const data = tokenService.validateAccessToken(accessToken);
    if (!data) {
      return next(ApiError.Unauthorized());
    }
    next();
  } catch (e) {
    return next(ApiError.Unauthorized());
  }
};
