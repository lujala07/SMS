import pool from '../config/database.js';
import { hashPassword } from '../utils/password.js';

export const getAllTeachers = async () => {
    const result = await pool.query(
        `SELECT
            teachers.id,
            teachers.user_id,
            teachers.department_id,
            teachers.first_name,
            teachers.last_name,
            teachers.phone_number,
            teachers.address,
            departments.name AS department_name,
            users.email,
            users.is_active
         FROM teachers
         JOIN users
            ON teachers.user_id = users.id
         LEFT JOIN departments
            ON teachers.department_id = departments.id
         ORDER BY teachers.id`
    );

    return result.rows;
};

export const createTeacher = async (
    email: string,
    password: string,
    departmentId: number | null,
    firstName: string,
    lastName: string,
    phoneNumber?: string,
    address?: string
) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const passwordHash = await hashPassword(password);

        const userResult = await client.query(
            `INSERT INTO users (
                email,
                password_hash,
                role
            )
            VALUES ($1, $2, 'teacher')
            RETURNING id, email, role, is_active`,
            [email, passwordHash]
        );

        const user = userResult.rows[0];

        const teacherResult = await client.query(
            `INSERT INTO teachers (
                user_id,
                department_id,
                first_name,
                last_name,
                phone_number,
                address
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                user.id,
                departmentId,
                firstName,
                lastName,
                phoneNumber || null,
                address || null
            ]
        );

        await client.query('COMMIT');

        return {
            user,
            teacher: teacherResult.rows[0]
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const updateTeacher = async (
    id: number,
    departmentId: number | null,
    firstName: string,
    lastName: string,
    phoneNumber?: string,
    address?: string
) => {
    const result = await pool.query(
        `UPDATE teachers
         SET department_id = $1,
             first_name = $2,
             last_name = $3,
             phone_number = $4,
             address = $5
         WHERE id = $6
         RETURNING *`,
        [
            departmentId,
            firstName,
            lastName,
            phoneNumber || null,
            address || null,
            id
        ]
    );

    return result.rows[0];
};

export const deleteTeacher = async (id: number) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const teacherResult = await client.query(
            `SELECT user_id
             FROM teachers
             WHERE id = $1`,
            [id]
        );

        const teacher = teacherResult.rows[0];

        if (!teacher) {
            await client.query('ROLLBACK');
            return null;
        }

        await client.query(
            `DELETE FROM teachers
             WHERE id = $1`,
            [id]
        );

        await client.query(
            `DELETE FROM users
             WHERE id = $1`,
            [teacher.user_id]
        );

        await client.query('COMMIT');

        return teacher;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};