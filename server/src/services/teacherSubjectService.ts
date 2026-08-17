import pool from '../config/database.js';

export const getAllTeacherSubjects = async () => {
    const result = await pool.query(
        `SELECT
            teacher_subjects.id,
            teacher_subjects.teacher_id,
            teacher_subjects.subject_id,
            teacher_subjects.assigned_at,
            teachers.first_name,
            teachers.last_name,
            subjects.name AS subject_name,
            subjects.code AS subject_code
         FROM teacher_subjects
         JOIN teachers
            ON teacher_subjects.teacher_id = teachers.id
         JOIN subjects
            ON teacher_subjects.subject_id = subjects.id
         ORDER BY teacher_subjects.id`
    );

    return result.rows;
};

export const assignTeacherToSubject = async (
    teacherId: number,
    subjectId: number
) => {
    const result = await pool.query(
        `INSERT INTO teacher_subjects (
            teacher_id,
            subject_id
        )
        VALUES ($1, $2)
        RETURNING *`,
        [teacherId, subjectId]
    );

    return result.rows[0];
};

export const removeTeacherSubject = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM teacher_subjects
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};