import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from the .env file
const isDev = process.env.NODE_ENV === 'development';

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