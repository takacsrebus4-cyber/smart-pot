const jwt = require("jsonwebtoken");
require("dotenv").config({path: "C:/Users/takac/OneDrive/Asztali gép/smart pot/tesztnodejs/backend/.env"});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" })
}
module.exports = generateAccessToken