require("dotenv").config()
const express = require("express")
const app = express()
app.use (express.json())
const jwt = require("jsonwebtoken")
const port = process.env.PORT
const cors = require('cors');
app.use(cors());
//We will run this server on a different port i.e. port 5000

app.listen(/*port*/5000, ()=> {
  console.log(`Validation server running on 5000`); //${port}...`);
});

app.post("/validateToken", validateToken, (req, res)=>{
  res.set('Access-Control-Allow-Origin', '*');
  //console.log("Token is valid");
  res.json({tokenValid: true});
});

function validateToken(req, res, next) {
  const token = req.body.accessToken;
  const refreshToken = req.body.refreshToken;

  if (token == null){
    res.sendStatus(400).json({tokenValid : false}); //if there is no token
  }

  jwt.verify(token, /*process.env.ACCESS_TOKEN_SECRET*/"fasz", (err, user) => {
    if (err) {
      jwt.verify(refreshToken, /*process.env.REFRESH_TOKEN_SECRET*/"fasz2", (err, user) => {
        if (err) {
          res.status(403).json({tokenValid : false, refreshTokenValid : false});
        }
        else {
          res.status(200).json({tokenValid : false, refreshTokenValid : true, refreshToken: refreshToken});
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