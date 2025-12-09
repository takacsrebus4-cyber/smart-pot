const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require('mysql2');
const generateAccessToken = require("./genAccessToken.js");
const generateRefreshToken = require("./genRefreshToken.js");
require("dotenv").config({ path: 'C:/Users/takac/OneDrive/Asztali gép/smart pot/tesztnodejs/backend/.env' });
const app = express();
const port = process.env.PORT;
let refreshTokens = [];
const cors = require('cors');
const { table, Console } = require("console");
const e = require("express");
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
})
);

const db = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//login
//no authorization needed
app.post("/login", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "users";
    var username = req.body.username;
    var password = req.body.password;
    connection.query(`SELECT * FROM ${table} WHERE name="${username}"`, async (err, result) => {
      connection.release();
      if (result.length == 0) {
        res.json({ userNotFound: true });
      }
      else {
        const hashedPassword = result[0].password;
        if (await bcrypt.compare(password, hashedPassword)) {

          const token = generateAccessToken({ user: username });
          const refreshToken = generateRefreshToken({ user: username });
          refreshTokens.push(refreshToken);

          res.json({ accessToken: token, refreshToken: refreshToken, userid: result[0].id });
        }
        else {
          res.json({ accessToken: undefined });
        }
      }
    });
  });
});

//logout
//authorized for normal users
app.post("/logout", (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token validation check
  if (validateToken(req.headers['authorization'])) {
    refreshTokens = refreshTokens.filter((c) => c != req.body.refreshToken)
    res.json({ logout: true });
  }
  else {
    res.json({ logout: false });
  }

});

//refresh token
//authorization implemented
app.post("/refreshToken", (req, res) => {
  var refreshToken = req.body.refreshToken;
  var username = req.body.username;

  refreshTokens = refreshTokens.filter((c) => c != refreshToken);
  //remove the old refreshToken from the refreshTokens list

  var accessToken = generateAccessToken({ user: username });
  refreshToken = generateRefreshToken({ user: username });
  //generate new accessToken and refreshTokens

  refreshTokens.push(refreshToken);

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});





//queries

//query plant_data table
//authorized for normal users
app.post("/query/plant_data", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token validation check
  if (validateToken(req.headers['authorization'])) {
    if (!req.body.plant_name) {
      db.getConnection(async (err, connection) => {
        if (err) throw (err)
        var table = "plants_data"
        connection.query(`SELECT * FROM ${table}`, async (err, result) => {
          res.json(result);
          connection.release();
        });
      });
    }
    else {
      db.getConnection(async (err, connection) => {
        if (err) throw (err)
        var table = "plants_data"
        var plant_name = req.body.plant_name;
        connection.query(`SELECT * FROM ${table} WHERE name="${plant_name}";`, async (err, result) => {
          res.json(result);
          connection.release();
        });
      });
    }
  }
  else {
    res.json({ tokenValid: false });
  }
});

//query users table
//needs higher level of security
app.get("/query/users", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token validation check
  if (!validateToken(req.headers['authorization'])) {
    db.getConnection(async (err, connection) => {
      if (err) throw (err);
      var table = "users"
      connection.query(`SELECT * FROM ${table}`, async (err, result) => {
        res.json(result);
        connection.release();
      });
    });
  }
  else {
    res.json({ tokenValid: false });
  }
});

//query current_plants table
//needs higher level of security
app.get("/query/current_plants", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token validation check
  if (validateToken(req.headers['authorization'])) {
    db.getConnection(async (err, connection) => {
      if (err) throw (err)
      var table = "current_plants"
      connection.query(`SELECT * FROM ${table}`, async (err, result) => {
        res.json(result);
        connection.release();
      });
    });
  }
  else {
    res.json({ tokenValid: false });
  }
});

//query latest data from weekly_data table
//authorized for normal users
app.get("/query/latest_data", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token validation check
  if (validateToken(req.headers['authorization'])) {
    db.getConnection(async (err, connection) => {
      if (err) throw (err)
      var table = "weekly_data"
      connection.query(`SELECT * FROM ${table} ORDER BY timestamp DESC LIMIT 1;`, async (err, result) => {
        res.json(result);
        connection.release();
      });
    });
  }
  else {
    res.json({ tokenValid: false });
  }
});

//query all data from weekly_data table
//authorized for normal users
app.get("/query/weekly_data", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token validation check
  if (validateToken(req.headers['authorization'])) {

    db.getConnection(async (err, connection) => {
      if (err) throw (err)
      var table = "weekly_data"
      connection.query(`SELECT * FROM ${table}`, async (err, result) => {
        res.json(result);
        connection.release();
      });

    });
  }
  else {
    res.json({ tokenValid: false });
  }
});

//query daily averages from weekly_data table
//authorized for normal users
app.post("/query/daily_average", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token validation check
  if (validateToken(req.headers['authorization'])) {
    db.getConnection(async (err, connection) => {
      if (err) throw (err)
      var table = "weekly_data";
      var plant_id = req.body.plant_id;
      connection.query(`SELECT DATE_FORMAT(timestamp, "%Y/%m/%d") as date, 
          AVG(light) as avg_light, 
          AVG(moisture) as avg_moisture,
          AVG(temperature) as avg_temperature,
          AVG(humidity) as avg_humidity
          FROM ${table}
          WHERE current_plant_id=${plant_id}
          GROUP BY DATE(timestamp);`, async (err, result) => {
        res.json(result);
        connection.release();
      });
    });
  }
  else {
    res.json({ tokenValid: false });
  }
});






//uploads

//upload into plant_data table
//needs higher level of security
app.post("/upload/plant", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token validation check
  if (!validateToken(req.headers['authorization'])) {
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
        (name, scientific_name, min_light, max_light, min_moisture, max_moisture, min_temperature, max_temperature, min_humidity, max_humidity)
        VALUES(
          "${name}", "${scientific_name}", ${min_light}, ${max_light}, ${min_moisture}, ${max_moisture},
          ${min_temperature}, ${max_temperature}, ${min_humidity}, ${max_humidity}
        )`, async (err, result) => {
        console.log(result);
        if (result != undefined && result.affectedRows > 0) {
          res.json({ success: true });
        }
        else {
          res.json({ success: false });
        }
        connection.release();
      });
    });
  }
  else {
    res.json({ tokenValid: false });
  }
});

//upload into current_plants table
//authorized for normal users
app.post("/upload/current_plant", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token existence check
  if (validateToken(req.headers['authorization'])) {
    var current_plant_table = "current_plants";
    var plants_data_table = "plants_data";
    var plant_name = req.body.plant_name;
    var user_id = req.body.userid;
    db.getConnection(async (err, connection) => {
      if (err) throw (err)
      connection.query(`SELECT * FROM ${plants_data_table} WHERE name="${plant_name}";`, async (err, result) => {
        connection.release();
        if (result.length == 0) {
          console.log("Plant not found in plants_data table, cannot upload current plant");
          connection.release();
          res.json({ success: false });
        }
        else {
          console.log("Plant found in plants_data table");
          db.getConnection(async (err, connection) => {
            console.log("Inserting current plant into current_plants table");
            if (err) throw (err)
            connection.query(`INSERT INTO ${current_plant_table}
                (plant_name, user_id) VALUES("${plant_name}", ${user_id});`, async (err, result) => {
              connection.release();
              if (result.affectedRows > 0) {
                res.json({ success: true });
              }
              else {
                res.json({ success: false });
              }
            });
          });
        }
      });
    });
  }
  else {
    res.json({ tokenValid: false });
  }
});

//upload into users table
//no authorization needed
app.post("/upload/user", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  db.getConnection(async (err, connection) => {
    if (err) throw (err);
    console.log(req.body);
    var table = "users"
    var username = req.body.username;
    if (!username || !req.body.password) {
      res.json({ valid: false });
    }
    else {
      var password = bcrypt.hashSync(req.body.password, 10);
      connection.query(`INSERT INTO ${table} (name,password) VALUES ("${username}","${password}"
    )`, async (err, result) => {
        connection.release();
        console.log(result);
        res.json({ valid: true });
      });
    }
  });
});

//upload into weekly_data table
//needs to be authorized for arduino!!!!!!!!
app.post("/upload/data", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log("Data upload request received");
  db.getConnection(async (err, connection) => {
    if (err) throw (err);
    console.log("Request body: ");
    console.log(req.body);
    var table = "weekly_data";
    var date = new Date();
    var timestamp = date.toISOString().split('T')[0] + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var light = req.body.light;
    var moisture = req.body.moisture;
    var temperature = req.body.temperature;
    var humidity = req.body.humidity;
    var current_plant_id = 3;

    connection.query(`DELETE FROM ${table} WHERE timestamp < NOW() - INTERVAL 7 DAY;`, async (err, result) => {
      connection.release();
      console.log("Result: ");
      console.log(result);
      console.log("Old data deleted from weekly_data");
    });

    connection.query(`INSERT INTO ${table}
        (timestamp, light, moisture, temperature, humidity, current_plant_id)
        VALUES(
          "${timestamp}", ${light}, ${moisture}, ${temperature}, ${humidity}, ${current_plant_id}
        )`, async (err, result) => {
      connection.release();
      console.log("Result: ");
      console.log(result);
      if (result != undefined && result.affectedRows > 0) {
        res.json({ success: true });
      }
      else {
        res.json({ success: false });
      }
    });
  });
});






//deletions

//delete plant data from weekly_data table
//authorized for normal users
app.delete("/delete/data", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //authorization check
  if (validateToken(req.headers['authorization'])) {
    db.getConnection(async (err, connection) => {
      if (err) throw (err);
      console.log(req.body);
      var table = "weekly_data"
      var plant_ids = "";
      for (i = 0; i < req.body.plant_ids.length; i++) {
        plant_ids += req.body.plant_ids[i];
        if (i != req.body.plant_ids.length - 1) {
          plant_ids += ", ";
        }
      }
      if (plant_ids != "") {
        connection.query(`DELETE FROM ${table} WHERE current_plant_id IN (${plant_ids});`, async (err, result) => {
          connection.release();
          console.log(result);
          if (result != undefined) {
            res.json({ success: true });
          }
          else {
            res.json({ success: false });
          }
        });
      }
      else {
        console.log("No plant IDs provided, no data to delete.");
        res.json({ dataFound: false });
      }
    });
  }
  else {
    res.json({ tokenValid: false });
  }
});

//delete plant from current_plants table
//authorized for normal users
app.delete("/delete/current_plant", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //authorization check
  if (validateToken(req.headers['authorization'])) {
    db.getConnection(async (err, connection) => {
      if (err) throw (err);
      //console.log(req.body);
      var table = "current_plants"
      var plant_ids = "";
      for (i = 0; i < req.body.plant_ids.length; i++) {
        plant_ids += req.body.plant_ids[i];
        if (i != req.body.plant_ids.length - 1) {
          plant_ids += ", ";
        }
      }
      if (plant_ids != "") {
        connection.query(`DELETE FROM ${table} WHERE id IN (${plant_ids});`, async (err, result) => {
          connection.release();
          //console.log(result);
          if (result != undefined) {
            res.json({ success: true });
          }
          else {
            res.json({ success: false });
          }
        });
      }
      else {
        console.log("No plant IDs provided, no plants to delete.");
        res.json({ dataFound: false });
      }
    });
  }
  else {
    res.json({ tokenValid: false });
  }
});

//delete user from users table
//authorized for normal users
app.delete("/delete/user", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token validation check
  if (validateToken(req.headers['authorization'])) {
    db.getConnection(async (err, connection) => {
      if (err) throw (err);
      console.log(req.body);
      var table = "users"
      var userid = req.body.userid;
      connection.query(`DELETE FROM ${table} WHERE id=${userid};`, async (err, result) => {
        console.log(result);
        if (result != undefined && result.affectedRows > 0) {
          res.json({ success: true });
        }
        else {
          res.json({ success: false });
        }
        connection.release();
      });
    });
  }
  else {
    res.json({ tokenValid: false });
  }
});

//lists plants belonging to the user
//authorized for normal users
app.post("/current_plant_list", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  //token validation check
  if (validateToken(req.headers['authorization'])) {
    db.getConnection(async (err, connection) => {
      if (err) throw (err);
      console.log(req.body);
      var table = "current_plants"
      var userid = req.body.userid;
      connection.query(`SELECT * FROM ${table} WHERE user_id=${userid};`, async (err, result) => {
        connection.release();
        console.log(result);
        res.json(result);
      });
    });
  }
  else {
    res.json({ tokenValid: false });
  }
});




function validateToken(header) {

  var token = "";

  //authorization header check
  if (!header) {
    res.json({ tokenValid: false });
  }
  else {
    token = header.split(' ')[1];
  }


  if (!token) {
    return false;
  }
  else {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return true;
    } catch (err) {
      return false;
    }
  }
}