import pool from '../config/database.js';

export const getAllAssignments = async () => {
    const result = await pool.query(
        `
        SELECT
            assignments.id,
            assignments.subject_id,
            assignments.teacher_id,
            assignments.title,
            assignments.description,
            assignments.due_date,
            assignments.total_marks,
            assignments.created_at,

            subjects.name AS subject_name,
            subjects.code AS subject_code,

            teachers.first_name AS teacher_first_name,
            teachers.last_name AS teacher_last_name

        FROM assignments

        JOIN subjects
            ON assignments.subject_id = subjects.id

        JOIN teachers
            ON assignments.teacher_id = teachers.id

        ORDER BY assignments.created_at DESC
        `
    );

    return result.rows;
};

export const getTeacherAssignments = async (
    userId: number
) => {
    const result = await pool.query(
        `
        SELECT
            assignments.id,
            assignments.subject_id,
            assignments.teacher_id,
            assignments.title,
            assignments.description,
            assignments.due_date,
            assignments.total_marks,
            assignments.created_at,

            subjects.name AS subject_name,
            subjects.code AS subject_code

        FROM assignments

        JOIN subjects
            ON assignments.subject_id = subjects.id

        JOIN teachers
            ON assignments.teacher_id = teachers.id

        WHERE teachers.user_id = $1

        ORDER BY assignments.created_at DESC
        `,
        [userId]
    );

    return result.rows;
};

export const getTeacherSubjectsForAssignments = async (
    userId: number
) => {
    const result = await pool.query(
        `
        SELECT
            subjects.id,
            subjects.name,
            subjects.code,

            classes.name AS class_name,
            classes.semester,
            classes.academic_year

        FROM teacher_subjects

        JOIN teachers
            ON teacher_subjects.teacher_id = teachers.id

        JOIN subjects
            ON teacher_subjects.subject_id = subjects.id

        JOIN classes
            ON subjects.class_id = classes.id

        WHERE teachers.user_id = $1

        ORDER BY subjects.name
        `,
        [userId]
    );

    return result.rows;
};

export const createAssignment = async (
    userId: number,
    subjectId: number,
    title: string,
    description: string | undefined,
    dueDate: string,
    totalMarks: number
) => {
    const teacherResult = await pool.query(
        `
        SELECT teachers.id

        FROM teachers

        JOIN teacher_subjects
            ON teacher_subjects.teacher_id = teachers.id

        WHERE teachers.user_id = $1
        AND teacher_subjects.subject_id = $2
        `,
        [
            userId,
            subjectId
        ]
    );

    const teacher = teacherResult.rows[0];

    if (!teacher) {
        throw new Error(
            'You are not assigned to this subject'
        );
    }

    const result = await pool.query(
        `
        INSERT INTO assignments (
            subject_id,
            teacher_id,
            title,
            description,
            due_date,
            total_marks
        )

        VALUES ($1, $2, $3, $4, $5, $6)

        RETURNING *
        `,
        [
            subjectId,
            teacher.id,
            title,
            description || null,
            dueDate,
            totalMarks
        ]
    );

    return result.rows[0];
};

export const updateAssignment = async (
    userId: number,
    id: number,
    subjectId: number,
    title: string,
    description: string | undefined,
    dueDate: string,
    totalMarks: number
) => {
    const teacherResult = await pool.query(
        `
        SELECT teachers.id

        FROM teachers

        JOIN teacher_subjects
            ON teacher_subjects.teacher_id = teachers.id

        WHERE teachers.user_id = $1
        AND teacher_subjects.subject_id = $2
        `,
        [
            userId,
            subjectId
        ]
    );

    const teacher = teacherResult.rows[0];

    if (!teacher) {
        throw new Error(
            'You are not assigned to this subject'
        );
    }

    const result = await pool.query(
        `
        UPDATE assignments

        SET
            subject_id = $1,
            title = $2,
            description = $3,
            due_date = $4,
            total_marks = $5

        WHERE id = $6
        AND teacher_id = $7

        RETURNING *
        `,
        [
            subjectId,
            title,
            description || null,
            dueDate,
            totalMarks,
            id,
            teacher.id
        ]
    );

    return result.rows[0];
};

export const deleteAssignment = async (
    userId: number,
    id: number
) => {
    const result = await pool.query(
        `
        DELETE FROM assignments

        WHERE id = $1
        AND teacher_id = (
            SELECT id
            FROM teachers
            WHERE user_id = $2
        )

        RETURNING *
        `,
        [
            id,
            userId
        ]
    );

    return result.rows[0];
};

export const getAssignmentsBySubject = async (
    subjectId: number
) => {
    const result = await pool.query(
        `
        SELECT
            assignments.*,
            subjects.name AS subject_name,
            subjects.code AS subject_code

        FROM assignments

        JOIN subjects
            ON assignments.subject_id = subjects.id

        WHERE assignments.subject_id = $1

        ORDER BY assignments.created_at DESC
        `,
        [subjectId]
    );

    return result.rows;
};