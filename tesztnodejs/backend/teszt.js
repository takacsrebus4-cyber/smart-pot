const express = require("express");
const mysql = require('mysql2/promise');
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
/*
async function modifyDb(method, table, data) {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'smart_pot'
      });
  
      if (method == "POST") {
        connection.execute(`INSERT INTO ${table}
          (name, scientific_name, min_Light, max_Light, min_moisture, max_moisture, min_temperature, max_temperature, min_humidity, max_humidity)
          VALUES(
            "${data.name}", "${data.scientific_name}", ${data.min_light}, ${data.max_light}, ${data.min_moisture}, ${data.max_moisture},
            ${data.min_temperature}, ${data.max_temperature}, ${data.max_humidity}, ${data.min_humidity}
          )`);      
        await connection.end();
        return "Sikeres feltöltés";
      }
        
       
      if (method == "GET") {
      // Execute a simple query
      const [rows, fields] = await connection.execute(`SELECT * FROM ${table}`);
      console.log('Query results:', rows);
      var asd = rows;    
      
      await connection.end();
      return asd;
      }
      
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
*/

app.get("/query/plants", async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'rebi',
        password: 'rebi2001',
        database: 'test'
      });
      var table = "plants_data"
      const [rows, fields] = await connection.execute(`SELECT * FROM ${table}`);
      //console.log('Query results:', rows); 
      res.json(rows); 
      
      await connection.end();

    } catch (error) {
      console.error('Database connection failed:', error);
    }
    /*
    var asd2 = await modifyDb("GET","plants_data",null)
    res.json(asd2);*/
});

app.post("/upload/plant", async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    //var method = req.method;
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'rebi',
        password: 'rebi2001',
        database: 'test'
      });

      console.log(req.body);
      var table = "plants_data"
      var data = req.body;
      connection.execute(`INSERT INTO ${table}
        (name, scientific_name, min_Light, max_Light, min_moisture, max_moisture, min_temperature, max_temperature, min_humidity, max_humidity)
        VALUES(
          "${data.name}", "${data.scientific_name}", ${data.min_light}, ${data.max_light}, ${data.min_moisture}, ${data.max_moisture},
          ${data.min_temperature}, ${data.max_temperature}, ${data.max_humidity}, ${data.min_humidity}
        )`);      
      await connection.end();


      res.json("Sikeres feltöltés");
    } catch (error) {
      console.error('Database connection failed:', error);
    }

    //var asd2 = await modifyDb(method, "plants_data", data)
});

app.get("/query/users", async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'rebi',
      password: 'rebi2001',
      database: 'test'
    });
    var table = "users"
    const [rows, fields] = await connection.execute(`SELECT * FROM ${table}`);
    res.json(rows); 
    
    await connection.end();

  } catch (error) {
    console.error('Database connection failed:', error);
  }
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
    var data = req.body;
    connection.execute(`INSERT INTO ${table} (name) VALUES ("${data.name}")`);      
    await connection.end();
    res.json("Sikeres feltöltés");

  } catch (error) {
    console.error('Database connection failed:', error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});