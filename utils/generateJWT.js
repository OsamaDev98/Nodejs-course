const jwt = require("jsonwebtoken");

const generateJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1m" });
};

module.exports = generateJWT;
