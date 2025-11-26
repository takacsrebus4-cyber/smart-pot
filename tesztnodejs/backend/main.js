const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require('mysql2');
const generateAccessToken = require("./genAccessToken.js");
const generateRefreshToken = require("./genRefreshToken.js");
require("dotenv").config({path: 'C:/Users/takac/OneDrive/Asztali gép/smart pot/tesztnodejs/backend/.env'});
const app = express();
const port = process.env.PORT;
let refreshTokens = [];
const userinfo = [];
const cors = require('cors');
const { table, Console } = require("console");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
})
);

const db = mysql.createPool({
  //connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
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
      console.log(result);
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
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
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

app.post("/upload_data", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log("Data upload request received");
  db.getConnection(async (err, connection) => {
    if (err) throw (err);
    console.log("Request body: ");
    console.log(req.body);
    var table1 = "current_data";
    var table2 = "weekly_data";
    var timestamp = req.body.timestamp;
    var light = req.body.light;
    var moisture = req.body.moisture;
    var temperature = req.body.temperature;
    var humidity = req.body.humidity;
    var current_plant_id = req.body.current_plant_id;
    connection.query(`TRUNCATE TABLE ${table1};`, async (err, result) => {
      connection.release();
      console.log("Result: ");
      console.log(result);
      console.log("Table truncated");
    });
    connection.query(`INSERT INTO ${table1}
        (timestamp, light, moisture, temperature, humidity, current_plant_id)
        VALUES(
          "${timestamp}", ${light}, ${moisture}, ${temperature}, ${humidity}, ${current_plant_id}
        );`, async (err, result) => {
      connection.release();
      console.log("Result: ");
      console.log(result);
    });

    connection.query(`DELETE FROM ${table2} WHERE timestamp < NOW() - INTERVAL 7 DAY;`, async (err, result) => {
      connection.release();
      console.log("Result: ");
      console.log(result);
      console.log("Old data deleted from weekly_data");
    });

    connection.query(`INSERT INTO ${table2}
        (timestamp, light, moisture, temperature, humidity, current_plant_id)
        VALUES(
          "${timestamp}", ${light}, ${moisture}, ${temperature}, ${humidity}, ${current_plant_id}
        )`, async (err, result) => {
      connection.release();
      console.log("Result: ");
      console.log(result);
      res.json("Sikeres feltöltés");
    });
  });
});

app.get("/query/current_data", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "current_data"
    connection.query(`SELECT * FROM ${table}`, async (err, result) => {
      res.json(result);
      connection.release();
    });
  });
});

app.get("/query/weekly_data", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "weekly_data"
    connection.query(`SELECT * FROM ${table}`, async (err, result) => {
      res.json(result);
      connection.release();
    });
  });
});

app.post("/login", async (req, res) => {
  let existingUser = false;
  res.set('Access-Control-Allow-Origin', '*');
  //console.log("Login request received");
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "users";
    var username = req.body.username;
    var password = req.body.password;
    connection.query(`SELECT * FROM ${table} WHERE name="${username}"`, async (err, result) => {
      connection.release();
      if (result.length == 0) {
        res.json({ userNotFound: true });
        //console.log("---------> User not found");
      }
      else {
        const hashedPassword = result[0].password;
        if (await bcrypt.compare(password, hashedPassword)) {

          const token = generateAccessToken({ user: username });
          const refreshToken = generateRefreshToken({ user: username });
          refreshTokens.push(refreshToken);


          //If user already exists in userinfo array, update tokens
          for (j = 0; j < userinfo.length; j++) {
            if (username == userinfo[j].username) {
              console.log("User found in userinfo array, updating tokens.");
              userinfo[j] = { username: username, accessToken: token, refreshToken: refreshToken };
              console.log("Userinfo array updated:", userinfo);
              existingUser = true;
              break;
            }
          }

          //If user does not exist in userinfo array, add new entry
          if (existingUser == false) {
            userinfo.push({ username: username, accessToken: token, refreshToken: refreshToken });
            //console.log("User not found in userinfo array, adding new entry.");
            //console.log("Userinfo array updated:", userinfo);
          }

          res.json({ accessToken: token });
        }
        else {
          res.json({ accessToken: undefined });
          //console.log("---------> Password Incorrect")
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
  let refreshToken = req.body.refreshToken;
  const username = req.body.username;
  console.log(refreshToken);
  if (!refreshTokens.includes(refreshToken)) {
    res.json({ accessToken: null, refreshToken: null })
  }
  else {

    refreshTokens = refreshTokens.filter((c) => c != refreshToken)
    //remove the old refreshToken from the refreshTokens list

    const accessToken = generateAccessToken({ user: username })
    refreshToken = generateRefreshToken({ user: username })
    //generate new accessToken and refreshTokens

    refreshTokens.push(refreshToken);

    for (j = 0; j < 1; j++) {
      if (userinfo[j].username == username) {
        userinfo[j] = { username: username, accessToken: accessToken, refreshToken: refreshToken };
        break;
      }
    }

    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  }

});

app.post("/logout", (req, res) => {

  let logout = false;

  refreshTokens = refreshTokens.filter((c) => c != req.body.refreshToken)
  //remove the old refreshToken from the refreshTokens list

  for (j = 0; j < userinfo.length; j++) {
    if (userinfo[j].username == req.body.username) {
      userinfo.splice(j, 1);
      console.log(userinfo)
      logout = true;
      break;
    }
  }

  res.json(logout);

});

app.post("/getUserinfo", (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  var found = false;

  for (j = 0; j < userinfo.length; j++) {
    if (userinfo[j].username == req.body.username) {
      found = true;
      res.json(userinfo[j]);
      break;
    }
  }

  if (found == false){
    res.json({ found: false });
  }
  
});