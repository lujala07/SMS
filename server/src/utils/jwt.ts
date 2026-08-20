import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error(
            'JWT_SECRET is missing from the .env file'
        );
    }

    return process.env.JWT_SECRET;
};

export const generateToken = (userId: number, role: string): string => {
    return jwt.sign(
        { userId, role },
        getJwtSecret(),
        { expiresIn: '1d' }
    );
};
