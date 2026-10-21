import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error(
            'JWT_SECRET is missing from the .env file'
        );
    }

    return process.env.JWT_SECRET;
};

interface JwtPayload {
    userId: number;
    role: string;
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authentication required'
        });
    }

    const token = authHeader.substring(7);

    let decoded: JwtPayload;
    try {
        const payload = jwt.verify(token, getJwtSecret());
        if (typeof payload === 'string' || !Number.isSafeInteger(payload.userId) || payload.userId <= 0) {
            throw new Error('Invalid user ID');
        }
        decoded = payload as JwtPayload;
    } catch {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }

    try {
        const result = await pool.query(
            'SELECT id, role FROM users WHERE id = $1 AND is_active = true AND password_hash IS NOT NULL',
            [decoded.userId]
        );
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ message: 'Invalid or inactive account' });
        }
        req.user = { userId: user.id, role: user.role };
    } catch (error) {
        return next(error);
    }

    next();
};
