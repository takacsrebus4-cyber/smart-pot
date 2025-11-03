const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateAccessToken(user) {
    console.log("Generating access token for user:", user);
    //console.log("Using secret:", process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign(user, /*process.env.ACCESS_TOKEN_SECRET*/"fasz", { expiresIn: "10s" })
}
module.exports = generateAccessToken