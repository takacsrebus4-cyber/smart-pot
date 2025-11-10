const jwt = require("jsonwebtoken");
require("dotenv").config();


function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, /*process.env.REFRESH_TOKEN_SECRET*/"fasz2", {expiresIn: "20s"})
  return refreshToken;
}
module.exports = generateRefreshToken