import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import pool from './config/database.js';

let io: Server | undefined;

export const initializeRealtime = (server: HttpServer) => {
    io = new Server(server, {
        cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }
    });
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (typeof token !== 'string' || !process.env.JWT_SECRET) throw new Error('Invalid token');
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            if (typeof payload === 'string' || !Number.isSafeInteger(payload.userId) || payload.userId <= 0 || !payload.exp) throw new Error('Invalid token');
            const result = await pool.query(
                'SELECT id FROM users WHERE id = $1 AND is_active = true AND password_hash IS NOT NULL',
                [payload.userId]
            );
            if (!result.rowCount) throw new Error('Invalid account');
            socket.data.userId = payload.userId;
            socket.data.expiresAt = payload.exp * 1000;
            next();
        } catch {
            next(new Error('Authentication required'));
        }
    });
    io.on('connection', socket => {
        void socket.join(`user:${socket.data.userId}`);
        const timer = setTimeout(() => socket.disconnect(true), Math.max(0, socket.data.expiresAt - Date.now()));
        timer.unref();
        socket.on('disconnect', () => clearTimeout(timer));
    });
    return io;
};

export const emitToUser = (userId: number, event: string, data: unknown) => {
    io?.to(`user:${userId}`).emit(event, data);
};
