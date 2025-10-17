const express = require("express");
const bcrypt = require("bcrypt");
const mysql = require('mysql2');
const generateAccessToken = require("./genToken")
const app = express();
const port = 3000;
const cors = require('cors');
const { table, Console } = require("console");
app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const db = mysql.createPool({
  connectionLimit: 10,
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
  res.set('Access-Control-Allow-Origin', '*');
  console.log("Login request received");
  db.getConnection(async (err, connection) => {
    if (err) throw (err)
    var table = "users"
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
          console.log("---------> Login Successful")
          const token = generateAccessToken({ user: username });
          console.log("Generated Token: ", token);
          res.json({accessToken: token})

        }
        else {
          console.log("---------> Password Incorrect")
          res.json({ ok: false })
        }
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});