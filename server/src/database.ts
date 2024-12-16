// src/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

require('dotenv').config();  // This loads environment variables from the .env file

// Load environment variables from .env file
dotenv.config();

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);


// Initialize Sequelize with SQL Server connection details
const sequelize = new Sequelize({
    dialect: 'mssql',                        // Dialect for SQL Server
    host: process.env.DB_HOST || 'localhost', // SQL Server host, default to localhost
    username: process.env.DB_USER,           // Windows username for SQL Server
    password: process.env.DB_PASSWORD,       // Password, if applicable
    database: process.env.DB_NAME,           // Database name
    dialectOptions: {
        encrypt: true,                       // Use encrypted connection
        trustServerCertificate: true,        // Trust server certificate
    },
    logging: false,                          // Disable Sequelize logging
});

sequelize.authenticate()  // Test the connection
    .then(() => console.log('Database connected successfully!'))
    .catch((err) => console.error('Database connection failed:', err));

export default sequelize;
