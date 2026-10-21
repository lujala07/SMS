import type { PoolClient } from 'pg';
import pool from '../config/database.js';
import { emitToUser } from '../realtime.js';

interface Notification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    link: string;
    read_at: string | null;
    created_at: string;
}

export const createNotifications = async (
    client: PoolClient,
    userIds: number[],
    title: string,
    message: string,
    link: string
): Promise<Notification[]> => {
    if (!userIds.length) return [];
    const result = await client.query<Notification>(
        `INSERT INTO notifications (user_id, title, message, link)
         SELECT id, $2, $3, $4 FROM users
         WHERE id = ANY($1::int[]) AND is_active = true AND password_hash IS NOT NULL
         RETURNING *`,
        [userIds, title, message, link]
    );
    return result.rows;
};

export const publishNotifications = (notifications: Notification[]) => {
    for (const notification of notifications) {
        emitToUser(notification.user_id, 'notification:new', notification);
    }
};

export const withNotificationTransaction = async <Value>(
    work: (client: PoolClient) => Promise<{ value: Value; notifications: Notification[] }>
) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { value, notifications } = await work(client);
        await client.query('COMMIT');
        publishNotifications(notifications);
        return value;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const getNotifications = async (userId: number, before?: number) => {
    const result = await pool.query(
        `SELECT
            COALESCE((SELECT json_agg(recent ORDER BY recent.id DESC) FROM (
                SELECT id, title, message, link, read_at, created_at FROM notifications
                WHERE user_id = $1 AND ($2::int IS NULL OR id < $2)
                ORDER BY id DESC LIMIT 50
            ) recent), '[]'::json) AS notifications,
            (SELECT COUNT(*)::int FROM notifications WHERE user_id = $1 AND read_at IS NULL) AS unread_count`,
        [userId, before ?? null]
    );
    return result.rows[0];
};

export const markNotificationsRead = async (userId: number, id: number, all: boolean) => {
    const result = await pool.query(
        `UPDATE notifications SET read_at = NOW()
         WHERE user_id = $1 AND read_at IS NULL AND ${all ? 'id <= $2' : 'id = $2'} RETURNING id`,
        [userId, id]
    );
    emitToUser(userId, 'notification:read', { ids: result.rows.map(row => row.id) });
};
