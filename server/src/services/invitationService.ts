import { createHash, randomBytes } from 'node:crypto';
import type { PoolClient } from 'pg';
import nodemailer from 'nodemailer';
import pool from '../config/database.js';
import { hashPassword } from '../utils/password.js';

export class InvitationError extends Error {
    constructor(message: string, public status = 400) {
        super(message);
    }
}

export const sendInvitation = async (client: PoolClient, userId: number, email: string) => {
    const { SMTP_USER, SMTP_PASSWORD, CLIENT_URL } = process.env;
    if (!SMTP_USER || !SMTP_PASSWORD || !CLIENT_URL) {
        throw new InvitationError('Email invitations are not configured. Please configure the server email settings.', 503);
    }
    const link = new URL('/set-password', CLIENT_URL);
    if (!['http:', 'https:'].includes(link.protocol)) {
        throw new InvitationError('Invalid invitation website URL', 503);
    }
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    await client.query(
        `INSERT INTO user_invitations (user_id, token_hash, expires_at)
         VALUES ($1, $2, NOW() + INTERVAL '24 hours')
         ON CONFLICT (user_id) DO UPDATE SET token_hash = EXCLUDED.token_hash, expires_at = EXCLUDED.expires_at`,
        [userId, tokenHash]
    );
    link.hash = token;
    const port = Number(process.env.SMTP_PORT || 465);
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port,
        secure: port === 465,
        requireTLS: port !== 465,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000
    });
    try {
        const result = await transport.sendMail({
            from: process.env.MAIL_FROM || SMTP_USER,
            to: email,
            subject: 'Set your SMS account password',
            text: `Your college has created an SMS account for you.\n\nSet your password using this link:\n${link.toString()}\n\nThis link expires in 24 hours and can only be used once.\nAfter setting your password, sign in using ${email}.\n\nIf you were not expecting this invitation, contact your college administrator.`
        });
        if (!result.accepted.length) throw new Error('Recipient rejected');
    } catch {
        throw new InvitationError('The invitation email could not be sent. Check email settings and try again.', 503);
    } finally {
        transport.close();
    }
};

export const setInvitedPassword = async (token: unknown, password: unknown) => {
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) {
        throw new InvitationError('This invitation is invalid or has expired. Ask your administrator for a new invitation.');
    }
    if (typeof password !== 'string' || password.trim().length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
        throw new InvitationError(typeof password !== 'string' || password.trim().length < 8 ? 'Password must be at least 8 characters.' : 'Password is too long.');
    }
    const passwordHash = await hashPassword(password);
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const invitation = await client.query(
            `DELETE FROM user_invitations WHERE token_hash = $1 AND expires_at > NOW() RETURNING user_id`,
            [tokenHash]
        );
        const userId = invitation.rows[0]?.user_id;
        if (!userId) throw new InvitationError('This invitation is invalid or has expired. Ask your administrator for a new invitation.');
        const updated = await client.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2 AND is_active = true AND password_hash IS NULL RETURNING id',
            [passwordHash, userId]
        );
        if (!updated.rowCount) throw new InvitationError('This invitation is no longer available. Contact your administrator.');
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const resendInvitation = async (email: string) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query(
            "SELECT id, email FROM users WHERE email = $1 AND role IN ('student', 'teacher') AND password_hash IS NULL AND is_active = true FOR UPDATE",
            [email]
        );
        const user = result.rows[0];
        if (!user) throw new InvitationError('No pending invitation found for this email.');
        await sendInvitation(client, user.id, user.email);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
