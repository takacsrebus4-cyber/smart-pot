const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Employee = sequelize.define('Plant', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    scientific_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    min_light: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    max_light: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    min_moisture: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    max_moisture: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    min_temperature: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    max_temperature: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    min_humidity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    max_humidity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});
module.exports = Plant;

// const mysql = require('mysql2/promise');
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'smart_pot'
    });

    // Execute a simple query
    const [rows, fields] = await connection.execute('SELECT * FROM plants_data');
    console.log('Query results:', rows);

    await connection.end();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}
// connectToDatabase();