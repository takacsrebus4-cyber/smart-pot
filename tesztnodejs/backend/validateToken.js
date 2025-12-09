require("dotenv").config({ path: "C:/Users/takac/OneDrive/Asztali gép/smart pot/tesztnodejs/backend/.env" });
const express = require("express")
const app = express()
app.use(express.json())
const jwt = require("jsonwebtoken")
const auth_port = process.env.AUTH_PORT
const cors = require('cors');
app.use(cors());
//We will run this server on a different port i.e. port 5000

app.listen(auth_port, () => {
  console.log(`Validation server running on ${auth_port}...`);
});

app.post("/validateToken", validateToken, (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  res.json({ tokenValid: true });
});

function validateToken(req, res, next) {
  console.log(req.body)
  const token = req.body.accessToken;
  const refreshToken = req.body.refreshToken;

  if (token == null || token == undefined) {
    res.json({ tokenValid: false }); //if there is no token
  }
  else{
     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (refreshToken == null || refreshToken == undefined) {
        res.status(403).json({ tokenValid: false, refreshTokenValid: false });
      }
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          res.status(403).json({ tokenValid: false, refreshTokenValid: false });
        }
        else {
          res.status(200).json({ tokenValid: false, refreshTokenValid: true, refreshToken: refreshToken });
        }
      });
    }
    else {
      req.user = user;
      res.token = token;
      next();
    }
  });
  }

 
}

module.exports = validateToken;