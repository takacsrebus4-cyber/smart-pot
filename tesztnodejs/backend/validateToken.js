require("dotenv").config()
const express = require("express")
const app = express()
app.use (express.json())
const jwt = require("jsonwebtoken")
const port = process.env.PORT
const cors = require('cors');
app.use(cors());
//We will run this server on a different port i.e. port 5000

app.listen(port,()=> {
  console.log(`Validation server running on ${port}...`);
});

app.get("/posts", validateToken, (req, res)=>{
  res.set('Access-Control-Allow-Origin', '*');
  console.log("Token is valid");
  res.json({tokenValid: true});
});

function validateToken(req, res, next) {
  //get token from request header
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
  
  if (token == null)
    res.sendStatus(400).json({tokenValid : false}); //if there is no token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

    if (err) {
      res.status(403).json({tokenValid : false});
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          res.status(403).json({refreshTokenValid : false});
        }
        else {
          res.status(200).json({refreshTokenValid : true});
        }
      });
    }
    else {
      req.user = user;
      res.token = token;
      next();
      //next(); //proceed to the next action in the calling function
    }
  });
}