const { HTTP_STATUS } = require("../utils/appConstant");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  token
    ? jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ status: HTTP_STATUS.FAIL, message: err.message });
        }
        req.user = decoded;
        next();
      })
    : res.status(401).json({
        status: HTTP_STATUS.FAIL,
        message: err.message || "Token not found",
      });
};

module.exports = verifyToken;
