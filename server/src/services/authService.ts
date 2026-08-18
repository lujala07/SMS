import pool from '../config/database.js';
import {
    comparePassword
} from '../utils/password.js';
import {
    generateToken
} from '../utils/jwt.js';

export const loginUser = async (
    email: string,
    password: string
) => {
    const result = await pool.query(
        `
        SELECT
            id,
            email,
            password_hash,
            role,
            is_active
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    const user = result.rows[0];

    if (!user) {
        throw new Error(
            'Invalid email or password'
        );
    }

    if (!user.is_active) {
        throw new Error(
            'Account is inactive'
        );
    }

    const passwordMatches =
        await comparePassword(
            password,
            user.password_hash
        );

    if (!passwordMatches) {
        throw new Error(
            'Invalid email or password'
        );
    }

    const token = generateToken(
        user.id,
        user.role
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    };
};