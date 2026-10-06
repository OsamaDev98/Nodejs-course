const { HTTP_STATUS } = require("../utils/appConstant");
const AppError = require("../utils/appError");

const userAllowed = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      const error = new AppError(
        "You are not allowed to perform this action",
        403,
        HTTP_STATUS.FAIL,
      );
      return next(error);
    }
    next();
  };
};

module.exports = userAllowed;
