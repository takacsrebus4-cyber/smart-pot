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

app.post("/login", async (req, res) => {
  let existingUser = false;
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

app.post("/logout", (req, res) => {

  refreshTokens = refreshTokens.filter((c) => c != req.body.refreshToken)

  res.json({ logout: true });

});

app.post("/refreshToken", (req, res) => {
  let refreshToken = req.body.refreshToken;
  const username = req.body.username;
  console.log(refreshToken);
  if (!refreshTokens.includes(refreshToken)) {
    res.json({ accessToken: null, refreshToken: null });
  }
  else {

    refreshTokens = refreshTokens.filter((c) => c != refreshToken);
    //remove the old refreshToken from the refreshTokens list

    const accessToken = generateAccessToken({ user: username });
    refreshToken = generateRefreshToken({ user: username });
    //generate new accessToken and refreshTokens

    refreshTokens.push(refreshToken);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  }

});

app.get("/query/plants", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.body.accessToken == undefined || req.body.refreshToken == undefined) {
    res.status(400).json({ tokenValid: false });
  }
  else {
    fetch("http:127.0.0.1:3000/validateToken", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accessToken': req.body.accessToken || '',
      },
    }).then(res => res.json()).then(response => {
      if (response.tokenValid == true) {
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
        res.json({ tokenValid: false });
      }
    });
  }
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

app.get("/query/current_plants", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "current_plants"
    connection.query(`SELECT * FROM ${table}`, async (err, result) => {
      res.json(result);
      connection.release();
    });
  });
});

app.get("/query/latest_data", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "weekly_data"
    connection.query(`SELECT * FROM ${table} ORDER BY timestamp DESC LIMIT 1;`, async (err, result) => {
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

app.get("/query/daily_average", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "weekly_data"
    connection.query(`SELECT DATE_FORMAT(timestamp, "%Y/%m/%d") as date, 
      AVG(light) as avg_light, 
      AVG(moisture) as avg_moisture,
      AVG(temperature) as avg_temperature,
      AVG(humidity) as avg_humidity
      FROM ${table} 
      GROUP BY DATE(timestamp);`, async (err, result) => {
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
        (name, scientific_name, min_light, max_light, min_moisture, max_moisture, min_temperature, max_temperature, min_humidity, max_humidity)
        VALUES(
          "${name}", "${scientific_name}", ${min_light}, ${max_light}, ${min_moisture}, ${max_moisture},
          ${min_temperature}, ${max_temperature}, ${min_humidity}, ${max_humidity}
        )`, async (err, result) => {
      console.log(result);
      if(result != undefined && result.affectedRows > 0){
        res.json({success: true});
      }
      else{
        res.json({success: false});
      }
      connection.release();
    });
  });
});

app.post("/upload/current_plant", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  var success = false;

  console.log(req.body);
  var current_plant_table = "current_plants";
  var plants_data_table = "plants_data";
  var plant_name = req.body.plant_name;
  var user_id = 5  // req.body.userid;

  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    connection.query(`SELECT * FROM ${plants_data_table} WHERE name="${plant_name}";`, async (err, result) => {
      if (result.length == 0) {
        console.log("Plant not found in plants_data table");
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
            console.log(result.affectedRows);
            if (result.affectedRows > 0) {
              res.json({ success: true });
            }
            else {
              res.json({ success: false });
            }
            connection.release();
          });
        });
        connection.release();
      }
    });
  });
});

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
      res.json("Sikeres feltöltés");
    });
  });
});


//még nem jó!!!!!
app.delete("/delete/current_plant", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log("Delete current plant request received");
  db.getConnection(async (err, connection) => {
    if (err) throw (err);
    console.log(req.body);
    var table = "current_plants"
    var plant_id = req.body.plant_id;
    var userid = req.body.userid;
    connection.query(`DELETE FROM ${table} WHERE (id=${plant_id} AND user_id=${userid});`, async (err, result) => {
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
});

app.post("/current_plant_list", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log("Current plant list request received");
  db.getConnection(async (err, connection) => {
    if (err) throw (err);
    console.log(req.body);
    var table = "current_plants"
    var userid = req.body.userid;
    connection.query(`SELECT * FROM ${table} WHERE user_id=${userid};`, async (err, result) => {
      console.log(result);
        res.json(result);
      connection.release();
    });
  });
});

app.get("/plant_name_list", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  console.log("Plant name list request received");
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "plants_data"
    connection.query(`SELECT name FROM ${table}`, async (err, result) => {
      console.log("Result: " + result);
      res.json(result);
      connection.release();
    });
  });
});