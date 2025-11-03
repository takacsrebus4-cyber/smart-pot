const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require('mysql2');
const generateAccessToken = require("./genAccessToken.js");
const generateRefreshToken = require("./genRefreshToken.js");
require("dotenv").config();
const app = express();
const port = 3000;
let refreshTokens = [];
const userinfo = [];
//let userIndex = 0;
const cors = require('cors');
const { table, Console } = require("console");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
})
);

console.log("port:", process.env.PORT);

const db = mysql.createPool({
  //connectionLimit: 10,
  host: "127.0.0.1",
  user: "rebi",
  password: "rebi2001",
  database: "test",
  port: "3306"
})

app.get("/query/plants", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "plants_data"
    connection.query(`SELECT * FROM ${table}`, async (err, result) => {
      res.json(result);
      connection.release();
    });
  });
});

app.post("/upload/plant", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log("Upload request received");
  db.getConnection(async (err, connection) => {
    console.log("valami");
    if (err) throw (err);
    console.log(req.body);
    var table = "plants_data"
    var name = req.body.name;
    var scientific_name = req.body.scientific_name;
    var min_light = req.body.min_light;
    var max_light = req.body.max_light;
    var min_moisture = req.body.min_moisture;
    var max_moisture = req.body.max_moisture;
    var min_temperature = req.body.min_temperature;
    var max_temperature = req.body.max_temperature;
    var min_humidity = req.body.min_humidity;
    var max_humidity = req.body.max_humidity;
    connection.query(`INSERT INTO ${table}
        (name, scientific_name, min_Light, max_Light, min_moisture, max_moisture, min_temperature, max_temperature, min_humidity, max_humidity)
        VALUES(
          "${name}", "${scientific_name}", ${min_light}, ${max_light}, ${min_moisture}, ${max_moisture},
          ${min_temperature}, ${max_temperature}, ${max_humidity}, ${min_humidity}
        )`, async (err, result) => {
      connection.release();
      console.log(result)
      res.send("Sikeres feltöltés");
      res.json("Sikeres feltöltés");
    });
  });
});

app.get("/query/users", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  db.getConnection(async (err, connection) => {
    if (err) throw (err);
    var table = "users"
    connection.query(`SELECT * FROM ${table}`, async (err, result) => {
      res.json(result);
      connection.release();
    });
  });
});

app.post("/upload/user", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'rebi',
      password: 'rebi2001',
      database: 'test'
    });

    console.log(req.body);
    var table = "users"
    var name = req.body.name;
    var password = bcrypt.hashSync(req.body.password, 10);
    connection.execute(`INSERT INTO ${table} (name,password) VALUES ("${name}","${password}")`);
    await connection.end();
    res.json("Sikeres feltöltés");

  } catch (error) {
    console.error('Database connection failed:', error);
  }
});

app.post("/login", async (req, res) => {
  let existingUser = false;
  res.set('Access-Control-Allow-Origin', '*');
  console.log("Login request received");
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "users";
    var username = req.body.username;
    var password = req.body.password;
    connection.query(`SELECT * FROM ${table} WHERE name="${username}"`, async (err, result) => {
      connection.release();
      if (result.length == 0) {
        res.sendStatus(404);
        console.log("---------> User not found");
      }
      else {
        const hashedPassword = result[0].password;
        if (await bcrypt.compare(password, hashedPassword)) {
          console.log("---------> Login Successful");
          const token = generateAccessToken({ user: username });
          console.log("Generated Access Token: ", token);
          const refreshToken = generateRefreshToken({ user: username });
          refreshTokens.push(refreshToken);
          console.log("Generated Refresh Token: ", refreshToken);
          res.json({ accessToken: token });


          //If user already exists in userinfo array, update tokens
          for (j = 0; j < userinfo.length; j++) {
            if (username == userinfo[j].username) {
              console.log("User found in userinfo array, updating tokens.");
              userinfo[j] = { username: username, accessToken: token, refreshToken: refreshToken };
              console.log("Userinfo array updated:", userinfo);
              existingUser = true;
              //localStorage.clear();
              //localStorage.setItem('userinfo', JSON.stringify(userinfo));
              //console.log("Local storage updated:", localStorage.getItem('userinfo'));
              break;
            }
          }

          //If user does not exist in userinfo array, add new entry
          if (existingUser == false) {
            userinfo.push({ username: username, accessToken: token, refreshToken: refreshToken });
            console.log("User not found in userinfo array, adding new entry.");
            console.log("Userinfo array updated:", userinfo);
            //localStorage.clear();
            //localStorage.setItem('userinfo', JSON.stringify(userinfo));
            //console.log("Local storage updated:", localStorage.getItem('userinfo'));
            //userIndex++;
          }
        }
        else {
          console.log("---------> Password Incorrect")
        }
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//REFRESH TOKEN API
app.post("/refreshToken", (req, res) => {
  console.log("Refresh token request received");
  const authHeader = req.headers["authorization"];
  let refreshToken = authHeader.split(" ")[1];
  console.log(refreshToken);
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).send("Refresh Token Invalid")
  }
  else {

    refreshTokens = refreshTokens.filter((c) => c != refreshToken)
    //remove the old refreshToken from the refreshTokens list

    const accessToken = generateAccessToken({ user: "Peti1"/*req.body.name*/ })
    refreshToken = generateRefreshToken({ user: "Peti1"/*req.body.name*/ })
    //generate new accessToken and refreshTokens

    console.log("userinfo ", userinfo);

    for (j = 0; j < 1; j++) {
      console.log("Checking userinfo entry:", userinfo[j]);
      if (userinfo[j].username == "Peti1") {
        console.log("User found in userinfo array, updating tokens.");
        userinfo[j] = { username: "Peti1", accessToken: accessToken, refreshToken: refreshToken };
        console.log("Userinfo array updated:", userinfo);
        //existingUser = true;
        //localStorage.clear();
        //localStorage.setItem('userinfo', JSON.stringify(userinfo));
        //console.log("Local storage updated:", localStorage.getItem('userinfo'));
        break;
      }
    }

    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  }

});

app.delete("/logout", (req, res) => {

  refreshTokens = refreshTokens.filter((c) => c != req.body.token)
  //remove the old refreshToken from the refreshTokens list

  res.status(204).send("Logged out!")
});


app.get("/getUserinfo", (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json(userinfo[0]);
});