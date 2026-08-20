import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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

export const authenticate = (
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

    try {
        const decoded = jwt.verify(token, getJwtSecret()) as unknown as JwtPayload;
        
        req.user = decoded;

        next();
    } catch {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};
