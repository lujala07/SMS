import pool from '../config/database.js';

export const getAllNotices = async () => {
    const result = await pool.query(
        `SELECT
            notices.id,
            notices.author_id,
            notices.title,
            notices.content,
            notices.audience,
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

export const createNotice = async (
    authorId: number,
    title: string,
    content: string,
    audience: string
) => {
    const result = await pool.query(
        `INSERT INTO notices (
            author_id,
            title,
            content,
            audience
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [
            authorId,
            title,
            content,
            audience
        ]
    );

    return result.rows[0];
};

export const updateNotice = async (
    id: number,
    title: string,
    content: string,
    audience: string
) => {
    const result = await pool.query(
        `UPDATE notices
         SET title = $1,
             content = $2,
             audience = $3
         WHERE id = $4
         RETURNING *`,
        [
            title,
            content,
            audience,
            id
        ]
    );

    return result.rows[0];
};

export const deleteNotice = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM notices
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

export const getNoticesByAudience = async (
    audience: string
) => {
    const result = await pool.query(
        `SELECT
            notices.*,
            users.email AS author_email
         FROM notices
         JOIN users
            ON notices.author_id = users.id
         WHERE notices.audience = 'all'
            OR notices.audience = $1
         ORDER BY notices.created_at DESC`,
        [audience]
    );

    return result.rows;
};