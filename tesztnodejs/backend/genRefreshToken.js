const jwt = require("jsonwebtoken");
require("dotenv").config({path: "C:/Users/takac/OneDrive/Asztali gép/smart pot/tesztnodejs/backend/.env"});


function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
  return refreshToken;
}
module.exports = generateRefreshToken