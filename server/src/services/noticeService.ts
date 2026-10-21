import pool from '../config/database.js';
import type { PoolClient } from 'pg';
import { createNotifications, withNotificationTransaction } from './notificationService.js';

export const getAllNotices = async () => {
    const result = await pool.query(
        `SELECT
            notices.id,
            notices.author_id,
            notices.title,
            notices.content,
            notices.audience,
            notices.status,
            notices.revision,
            notices.created_at,
            users.email AS author_email,
            users.role AS author_role
         FROM notices
         JOIN users
            ON notices.author_id = users.id
         ORDER BY notices.created_at DESC`
    );

    return result.rows;
};

export const getTeacherRelevantNotices = async (
    userId: number
) => {
    const result = await pool.query(
        `SELECT
            notices.id,
            notices.author_id,
            notices.title,
            notices.content,
            notices.audience,
            notices.status,
            notices.revision,
            notices.created_at,
            users.email AS author_email,
            users.role AS author_role,

            CASE
                WHEN notices.author_id = $1
                THEN TRUE
                ELSE FALSE
            END AS is_own

         FROM notices

         JOIN users
            ON notices.author_id = users.id

         WHERE
            (notices.status = 'approved' AND notices.audience IN ('all', 'teachers'))
            OR notices.author_id = $1

         ORDER BY notices.created_at DESC`,
        [userId]
    );

    return result.rows;
};

interface NoticeRecord {
    id: number;
    author_id: number;
    title: string;
    audience: string;
    status: 'pending' | 'approved' | 'rejected';
}

const notifyPublishedNotice = async (client: PoolClient, notice: NoticeRecord, actorId = notice.author_id) => {
    const recipients = await client.query(
        `SELECT id, role FROM users WHERE id <> $1
         AND (role = 'admin' OR $2 = 'all' OR role = CASE WHEN $2 = 'teachers' THEN 'teacher' ELSE 'student' END)`,
        [notice.author_id, notice.audience]
    );
    const notifications = [];
    for (const role of ['admin', 'teacher', 'student']) {
        notifications.push(...await createNotifications(
            client, recipients.rows.filter(user => user.role === role && user.id !== actorId).map(user => user.id),
            'New notice', notice.title, role === 'student' ? '/student' : `/${role}/notices`
        ));
    }
    return notifications;
};

const notifyNoticeReviewers = async (client: PoolClient, title: string) => {
    const admins = await client.query("SELECT id FROM users WHERE role = 'admin'");
    return createNotifications(client, admins.rows.map(user => user.id), 'Notice awaiting approval', title, '/admin/notices');
};

export const createNotice = async (
    authorId: number,
    title: string,
    content: string,
    audience: string
) => withNotificationTransaction(async client => {
    const author = await client.query("SELECT role FROM users WHERE id = $1 AND role IN ('admin', 'teacher')", [authorId]);
    if (!author.rows[0]) throw new Error('Not allowed to create notices');
    const status = author.rows[0].role === 'admin' ? 'approved' : 'pending';
    const result = await client.query(
        `INSERT INTO notices (author_id, title, content, audience, status)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [authorId, title, content, audience, status]
    );
    const notice = result.rows[0];
    const notifications = status === 'approved'
        ? await notifyPublishedNotice(client, notice)
        : await notifyNoticeReviewers(client, title);
    return { value: notice, notifications };
});

export const updateNotice = async (
    id: number,
    userId: number,
    userRole: string,
    title: string,
    content: string,
    audience: string
) => withNotificationTransaction(async client => {
    const result = await client.query(
        `UPDATE notices SET title = $1, content = $2, audience = $3, revision = revision + 1,
            status = CASE WHEN $6 = 'teacher' THEN 'pending' ELSE status END,
            reviewed_by = CASE WHEN $6 = 'teacher' THEN NULL ELSE reviewed_by END,
            reviewed_at = CASE WHEN $6 = 'teacher' THEN NULL ELSE reviewed_at END
         WHERE id = $4 AND ($6 = 'admin' OR author_id = $5)
         RETURNING *`,
        [title, content, audience, id, userId, userRole]
    );
    const notice = result.rows[0];
    const notifications = notice && userRole === 'teacher' ? await notifyNoticeReviewers(client, title) : [];
    return { value: notice, notifications };
});

export const reviewNotice = async (
    id: number,
    adminId: number,
    status: 'approved' | 'rejected',
    revision: number
) => withNotificationTransaction(async client => {
    const result = await client.query(
        `UPDATE notices SET status = $1, reviewed_by = $2, reviewed_at = NOW()
         WHERE id = $3 AND status = 'pending' AND revision = $4
         AND EXISTS (SELECT 1 FROM users WHERE id = $2 AND role = 'admin' AND is_active = true)
         RETURNING *`,
        [status, adminId, id, revision]
    );
    const notice = result.rows[0];
    if (!notice) return { value: null, notifications: [] };
    const notifications = status === 'approved' ? await notifyPublishedNotice(client, notice, adminId) : [];
    notifications.push(...await createNotifications(
        client, [notice.author_id], status === 'approved' ? 'Notice approved' : 'Notice rejected', notice.title, '/teacher/notices'
    ));
    return { value: notice, notifications };
});

export const deleteNotice = async (
    id: number,
    userId: number,
    userRole: string
) => {
    if (userRole === 'admin') {
        const result = await pool.query(
            `DELETE FROM notices
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        return result.rows[0];
    }

    const result = await pool.query(
        `DELETE FROM notices
         WHERE id = $1
         AND author_id = $2
         RETURNING *`,
        [
            id,
            userId
        ]
    );

    return result.rows[0];
};

export const getNoticesByAudience = async (
    audience: string
) => {
    const result = await pool.query(
        `SELECT
            notices.*,
            users.email AS author_email,
            users.role AS author_role
         FROM notices
         JOIN users
            ON notices.author_id = users.id
         WHERE notices.status = 'approved'
            AND (notices.audience = 'all' OR notices.audience = $1)
         ORDER BY notices.created_at DESC`,
        [audience]
    );

    return result.rows;
};
