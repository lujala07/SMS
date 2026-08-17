import pool from '../config/database.js';

export const getAllAssignments = async () => {
    const result = await pool.query(
        `SELECT
            assignments.id,
            assignments.subject_id,
            assignments.teacher_id,
            assignments.title,
            assignments.description,
            assignments.due_date,
            assignments.total_marks,
            assignments.created_at,
            subjects.name AS subject_name,
            teachers.first_name AS teacher_first_name,
            teachers.last_name AS teacher_last_name
         FROM assignments
         JOIN subjects
            ON assignments.subject_id = subjects.id
         JOIN teachers
            ON assignments.teacher_id = teachers.id
         ORDER BY assignments.created_at DESC`
    );

    return result.rows;
};

export const createAssignment = async (
    subjectId: number,
    teacherId: number,
    title: string,
    description: string | undefined,
    dueDate: string,
    totalMarks: number
) => {
    const result = await pool.query(
        `INSERT INTO assignments (
            subject_id,
            teacher_id,
            title,
            description,
            due_date,
            total_marks
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            subjectId,
            teacherId,
            title,
            description || null,
            dueDate,
            totalMarks
        ]
    );

    return result.rows[0];
};

export const updateAssignment = async (
    id: number,
    subjectId: number,
    title: string,
    description: string | undefined,
    dueDate: string,
    totalMarks: number
) => {
    const result = await pool.query(
        `UPDATE assignments
         SET subject_id = $1,
             title = $2,
             description = $3,
             due_date = $4,
             total_marks = $5
         WHERE id = $6
         RETURNING *`,
        [
            subjectId,
            title,
            description || null,
            dueDate,
            totalMarks,
            id
        ]
    );

    return result.rows[0];
};

export const deleteAssignment = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM assignments
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

export const getAssignmentsBySubject = async (
    subjectId: number
) => {
    const result = await pool.query(
        `SELECT
            assignments.*,
            subjects.name AS subject_name
         FROM assignments
         JOIN subjects
            ON assignments.subject_id = subjects.id
         WHERE assignments.subject_id = $1
         ORDER BY assignments.created_at DESC`,
        [subjectId]
    );

    return result.rows;
};