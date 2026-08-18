import 'dotenv/config';
import bcrypt from 'bcrypt';
import pool from './config/database.js';

const createAdmin = async () => {
    try {
        const email = 'admin@test.com';
        const password = 'admin123';

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        const result = await pool.query(
            `
            INSERT INTO users (
                email,
                password_hash,
                role,
                is_active
            )
            VALUES ($1, $2, 'admin', true)

            ON CONFLICT (email)
            DO UPDATE SET
                password_hash = EXCLUDED.password_hash,
                role = 'admin',
                is_active = true

            RETURNING
                id,
                email,
                role,
                is_active
            `,
            [
                email,
                passwordHash
            ]
        );

        console.log(
            'Admin ready:',
            result.rows[0]
        );

        console.log('');
        console.log('Login credentials:');
        console.log('Email: admin@test.com');
        console.log('Password: admin123');
    } catch (error) {
        console.error(
            'Could not create admin:',
            error
        );
    } finally {
        await pool.end();
    }
};

createAdmin();