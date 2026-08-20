import 'dotenv/config';
import { Pool } from 'pg';

const requiredVariables = [
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET'
];

for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `${variable} is missing from the .env file`
        );
    }
}

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

export default pool;
