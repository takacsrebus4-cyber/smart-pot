const express = require("express")
const app = express()
const mysql = require("mysql2")
const db = mysql.createPool({
   connectionLimit: 100,
   host: "127.0.0.1",       //This is your localhost IP
   user: "rebi",         // "newuser" created in Step 1(e)
   password: "rebi2001",  // password for the new user
   database: "test",      // Database name
   port: "3306"             // port name, "3306" by default
})
db.getConnection( (err, connection)=> {   if (err) throw (err)
   console.log ("DB connected successful: " + connection.threadId)})