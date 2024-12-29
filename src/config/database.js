const mysql = require('mysql2');
require('dotenv').config();

// Log environment variables (remove in production)
console.log('Database Config:', {
    host: process.env.DB_HOST || 'not set',
    user: process.env.DB_USER || 'not set',
    database: process.env.DB_NAME || 'not set',
    // Don't log password
});

// Create connection with promise wrapper
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();  // Add promise() here

// Handle connection errors
db.connect()
    .then(() => {
        console.log('Connected to MySQL');
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err);
        console.error('Connection details:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            // Don't log password
        });
    });

module.exports = db;