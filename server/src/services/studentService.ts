import pool from '../config/database.js';
import { hashPassword } from '../utils/password.js';

export const getAllStudents = async () => {
    const result = await pool.query(
        `SELECT
            students.id,
            students.user_id,
            students.class_id,
            students.student_code,
            students.first_name,
            students.last_name,
            students.date_of_birth,
            students.phone_number,
            students.address,
            students.gender,

            classes.name AS class_name,
            classes.semester,
            classes.academic_year,

            users.email,
            users.is_active

         FROM students

         JOIN users
            ON students.user_id = users.id

         JOIN classes
            ON students.class_id = classes.id

         ORDER BY students.id`
    );

    return result.rows;
};

export const getStudentByUserId = async (
    userId: number
) => {
    const result = await pool.query(
        `SELECT
            students.id,
            students.user_id,
            students.class_id,
            students.student_code,
            students.first_name,
            students.last_name,
            students.date_of_birth,
            students.phone_number,
            students.address,
            students.gender,

            classes.name AS class_name,
            classes.semester,
            classes.academic_year,

            departments.name AS department_name,

            users.email,
            users.is_active

         FROM students

         JOIN users
            ON students.user_id = users.id

         JOIN classes
            ON students.class_id = classes.id

         JOIN departments
            ON classes.department_id = departments.id

         WHERE students.user_id = $1`,
        [userId]
    );

    return result.rows[0];
};

export const getStudentDashboardData = async (
    userId: number
) => {
    const student =
        await getStudentByUserId(
            userId
        );

    if (!student) {
        throw new Error(
            'Student profile not found'
        );
    }

    const attendanceResult =
        await pool.query(
            `SELECT
                status,
                COUNT(*) AS total

             FROM attendance

             WHERE student_id = $1

             GROUP BY status`,
            [student.id]
        );

    const assignmentResult =
        await pool.query(
            `SELECT
                assignments.id,
                assignments.title,
                assignments.description,
                assignments.due_date,
                assignments.total_marks,

                subjects.name AS subject_name,
                subjects.code AS subject_code,

                teachers.id AS teacher_id,
                teachers.first_name AS teacher_first_name,
                teachers.last_name AS teacher_last_name,

                CONCAT(
                    teachers.first_name,
                    ' ',
                    teachers.last_name
                ) AS teacher_name,

                submissions.id AS submission_id,
                submissions.status AS submission_status,
                submissions.submission_text,
                submissions.file_url,
                submissions.submitted_at,
                submissions.marks_obtained,
                submissions.feedback

             FROM assignments

             JOIN subjects
                ON assignments.subject_id = subjects.id

             JOIN teachers
                ON assignments.teacher_id = teachers.id

             LEFT JOIN submissions
                ON submissions.assignment_id = assignments.id
                AND submissions.student_id = $1

             WHERE subjects.class_id = $2

             ORDER BY assignments.due_date ASC`,
            [
                student.id,
                student.class_id
            ]
        );

    const noticeResult =
        await pool.query(
            `SELECT
                notices.id,
                notices.title,
                notices.content,
                notices.audience,
                notices.created_at,

                users.email AS author_email

             FROM notices

             JOIN users
                ON notices.author_id = users.id

             WHERE
                notices.audience = 'all'
                OR notices.audience = 'students'

             ORDER BY notices.created_at DESC

             LIMIT 5`
        );

    return {
        student,
        attendance:
            attendanceResult.rows,
        assignments:
            assignmentResult.rows,
        notices:
            noticeResult.rows
    };
};

export const createStudent = async (
    email: string,
    password: string,
    classId: number,
    studentCode: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string,
    phoneNumber?: string,
    address?: string,
    gender?: string
) => {
    const client =
        await pool.connect();

    try {
        await client.query(
            'BEGIN'
        );

        const passwordHash =
            await hashPassword(
                password
            );

        const userResult =
            await client.query(
                `INSERT INTO users (
                    email,
                    password_hash,
                    role
                )

                VALUES (
                    $1,
                    $2,
                    'student'
                )

                RETURNING
                    id,
                    email,
                    role,
                    is_active`,
                [
                    email,
                    passwordHash
                ]
            );

        const user =
            userResult.rows[0];

        const studentResult =
            await client.query(
                `INSERT INTO students (
                    user_id,
                    class_id,
                    student_code,
                    first_name,
                    last_name,
                    date_of_birth,
                    phone_number,
                    address,
                    gender
                )

                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9
                )

                RETURNING *`,
                [
                    user.id,
                    classId,
                    studentCode,
                    firstName,
                    lastName,
                    dateOfBirth || null,
                    phoneNumber || null,
                    address || null,
                    gender || null
                ]
            );

        await client.query(
            'COMMIT'
        );

        return {
            user,
            student:
                studentResult.rows[0]
        };

    } catch (error) {
        await client.query(
            'ROLLBACK'
        );

        throw error;

    } finally {
        client.release();
    }
};

export const updateStudent = async (
    id: number,
    classId: number,
    studentCode: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string,
    phoneNumber?: string,
    address?: string,
    gender?: string
) => {
    const result = await pool.query(
        `UPDATE students

         SET
            class_id = $1,
            student_code = $2,
            first_name = $3,
            last_name = $4,
            date_of_birth = $5,
            phone_number = $6,
            address = $7,
            gender = $8

         WHERE id = $9

         RETURNING *`,
        [
            classId,
            studentCode,
            firstName,
            lastName,
            dateOfBirth || null,
            phoneNumber || null,
            address || null,
            gender || null,
            id
        ]
    );

    return result.rows[0];
};

export const deleteStudent = async (
    id: number
) => {
    const client =
        await pool.connect();

    try {
        await client.query(
            'BEGIN'
        );

        const studentResult =
            await client.query(
                `SELECT user_id
                 FROM students
                 WHERE id = $1`,
                [id]
            );

        const student =
            studentResult.rows[0];

        if (!student) {
            await client.query(
                'ROLLBACK'
            );

            return null;
        }

        await client.query(
            `DELETE FROM students
             WHERE id = $1`,
            [id]
        );

        await client.query(
            `DELETE FROM users
             WHERE id = $1`,
            [
                student.user_id
            ]
        );

        await client.query(
            'COMMIT'
        );

        return student;

    } catch (error) {
        await client.query(
            'ROLLBACK'
        );

        throw error;

    } finally {
        client.release();
    }
};