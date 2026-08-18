import 'dotenv/config';
import app from './app.js';
import pool from './config/database.js';

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
    try {
        await pool.query('SELECT NOW()');

        console.log(
            'PostgreSQL connected successfully'
        );

        app.listen(PORT, () => {
            console.log(
                `Server is running on http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            'Error connecting to PostgreSQL:',
            error
        );

        process.exit(1);
    }
};

startServer();