import pool from '../config/database.js';
import { hashPassword } from '../utils/password.js';

export const createAdminUser = async (
    email: string,
    password: string
) => {
    const passwordHash = await hashPassword(password);

    const result = await pool.query(
        `
        INSERT INTO users (
            email,
            password_hash,
            role
        )
        VALUES ($1, $2, 'admin')
        RETURNING
            id,
            email,
            role,
            is_active,
            created_at
        `,
        [email, passwordHash]
    );

    return result.rows[0];
};