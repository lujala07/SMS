import pool from '../config/database.js';

export const getAllAttendance = async () => {
    const result = await pool.query(
        `SELECT
            attendance.id,
            attendance.student_id,
            attendance.subject_id,
            attendance.marked_by,
            attendance.attendance_date,
            attendance.status,
            students.first_name,
            students.last_name,
            subjects.name AS subject_name,
            teachers.first_name AS teacher_first_name,
            teachers.last_name AS teacher_last_name
         FROM attendance
         JOIN students
            ON attendance.student_id = students.id
         JOIN subjects
            ON attendance.subject_id = subjects.id
         JOIN teachers
            ON attendance.marked_by = teachers.id
         ORDER BY attendance.attendance_date DESC`
    );

    return result.rows;
};

export const createAttendance = async (
    studentId: number,
    subjectId: number,
    markedBy: number,
    status: string,
    attendanceDate?: string
) => {
    const result = await pool.query(
        `INSERT INTO attendance (
            student_id,
            subject_id,
            marked_by,
            attendance_date,
            status
        )
        VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE), $5)
        RETURNING *`,
        [
            studentId,
            subjectId,
            markedBy,
            attendanceDate || null,
            status
        ]
    );

    return result.rows[0];
};

export const updateAttendance = async (
    id: number,
    status: string
) => {
    const result = await pool.query(
        `UPDATE attendance
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [status, id]
    );

    return result.rows[0];
};

export const deleteAttendance = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM attendance
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

export const getAttendanceByStudent = async (
    studentId: number
) => {
    const result = await pool.query(
        `SELECT
            attendance.id,
            attendance.attendance_date,
            attendance.status,
            subjects.name AS subject_name,
            subjects.code AS subject_code
         FROM attendance
         JOIN subjects
            ON attendance.subject_id = subjects.id
         WHERE attendance.student_id = $1
         ORDER BY attendance.attendance_date DESC`,
        [studentId]
    );

    return result.rows;
};