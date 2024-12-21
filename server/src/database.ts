import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from the .env file

// Initialize Sequelize with SQL Server connection details
const sequelize = new Sequelize({
    dialect: 'mssql',                        // Dialect for SQL Server
    host: process.env.DB_HOST || 'localhost', // SQL Server host
    port: parseInt(process.env.DB_PORT || '1433', 10), // Port for SQL Server
    username: process.env.DB_USER,           // SQL Server username
    password: process.env.DB_PASSWORD,       // SQL Server password
    database: process.env.DB_NAME,           // Database name
    dialectOptions: {
        encrypt: true,                       // Use encrypted connection
        trustServerCertificate: true,        // Trust server certificate (for self-signed)
    },
    logging: false,                          // Disable logging for cleaner console
});

// Test the database connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully!');
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit process if DB connection fails
    }
})();

export default sequelize;
