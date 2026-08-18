import 'dotenv/config';
import { Pool } from 'pg';

const DB_PASSWORD = process.env.DB_PASSWORD;

if (typeof DB_PASSWORD !== 'string') {
    throw new Error(
        'DB_PASSWORD is missing from the .env file'
    );
}

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: DB_PASSWORD
});

export default pool;