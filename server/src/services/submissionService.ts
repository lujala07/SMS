import pool from '../config/database.js';

export const getAllSubmissions = async () => {
    const result = await pool.query(
        `SELECT
            submissions.id,
            submissions.assignment_id,
            submissions.student_id,
            submissions.submission_text,
            submissions.file_url,
            submissions.submitted_at,
            submissions.marks_obtained,
            submissions.feedback,
            submissions.status,
            assignments.title AS assignment_title,
            students.first_name,
            students.last_name,
            students.student_code
         FROM submissions
         JOIN assignments
            ON submissions.assignment_id = assignments.id
         JOIN students
            ON submissions.student_id = students.id
         ORDER BY submissions.submitted_at DESC`
    );

    return result.rows;
};

export const createSubmission = async (
    assignmentId: number,
    studentId: number,
    submissionText?: string,
    fileUrl?: string,
    status: string = 'submitted'
) => {
    const result = await pool.query(
        `INSERT INTO submissions (
            assignment_id,
            student_id,
            submission_text,
            file_url,
            status
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            assignmentId,
            studentId,
            submissionText || null,
            fileUrl || null,
            status
        ]
    );

    return result.rows[0];
};

export const reviewSubmission = async (
    id: number,
    marksObtained: number,
    feedback?: string
) => {
    const result = await pool.query(
        `UPDATE submissions
         SET marks_obtained = $1,
             feedback = $2,
             status = 'reviewed'
         WHERE id = $3
         RETURNING *`,
        [
            marksObtained,
            feedback || null,
            id
        ]
    );

    return result.rows[0];
};

export const getSubmissionsByAssignment = async (
    assignmentId: number
) => {
    const result = await pool.query(
        `SELECT
            submissions.*,
            students.first_name,
            students.last_name,
            students.student_code
         FROM submissions
         JOIN students
            ON submissions.student_id = students.id
         WHERE submissions.assignment_id = $1
         ORDER BY submissions.submitted_at DESC`,
        [assignmentId]
    );

    return result.rows;
};

export const getSubmissionsByStudent = async (
    studentId: number
) => {
    const result = await pool.query(
        `SELECT
            submissions.*,
            assignments.title AS assignment_title
         FROM submissions
         JOIN assignments
            ON submissions.assignment_id = assignments.id
         WHERE submissions.student_id = $1
         ORDER BY submissions.submitted_at DESC`,
        [studentId]
    );

    return result.rows;
};