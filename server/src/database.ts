import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';


dotenv.config(); 
const environment = process.env.NODE_ENV || 'development';
const envFilePath = `.env.${environment}`;

// Load environment variables from the correct .env file
if (fs.existsSync(envFilePath)) {
    console.log(`Loading environment variables from ${envFilePath}`);
    dotenv.config({ path: envFilePath });
} else {
    console.warn(`Warning: ${envFilePath} does not exist.`);
}

const isDev = environment === 'development';

// Ensure that all required environment variables are defined
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Error: Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
});

const sequelize = new Sequelize({
    dialect: 'mssql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '1433', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialectOptions: {
        encrypt: true,
        trustServerCertificate: true,
    },
    logging: !isDev,
});

console.log('DB_HOST:', process.env.DB_HOST);

export default sequelize;