import pool from '../config/database.js';

export const getDashboardSummary = async () => {
    const result = await pool.query(
        `SELECT
            (SELECT COUNT(*) FROM students) AS total_students,
            (SELECT COUNT(*) FROM teachers) AS total_teachers,
            (SELECT COUNT(*) FROM departments) AS total_departments,
            (SELECT COUNT(*) FROM classes) AS total_classes,
            (SELECT COUNT(*) FROM subjects) AS total_subjects,
            (SELECT COUNT(*) FROM assignments) AS total_assignments`
    );

    return result.rows[0];
};

export const getAttendanceSummary = async () => {
    const result = await pool.query(
        `SELECT
            status,
            COUNT(*) AS total
         FROM attendance
         GROUP BY status
         ORDER BY status`
    );

    return result.rows;
};

export const getStudentAttendanceReport = async (
    studentId: number
) => {
    const result = await pool.query(
        `SELECT
            subjects.name AS subject_name,
            subjects.code AS subject_code,
            COUNT(*) AS total_classes,
            COUNT(*) FILTER (
                WHERE attendance.status = 'present'
            ) AS present_count,
            COUNT(*) FILTER (
                WHERE attendance.status = 'absent'
            ) AS absent_count,
            COUNT(*) FILTER (
                WHERE attendance.status = 'late'
            ) AS late_count,
            COUNT(*) FILTER (
                WHERE attendance.status = 'excused'
            ) AS excused_count
         FROM attendance
         JOIN subjects
            ON attendance.subject_id = subjects.id
         WHERE attendance.student_id = $1
         GROUP BY
            subjects.id,
            subjects.name,
            subjects.code
         ORDER BY subjects.name`,
        [studentId]
    );

    return result.rows;
};

export const getAssignmentSummary = async () => {
    const result = await pool.query(
        `SELECT
            assignments.id,
            assignments.title,
            subjects.name AS subject_name,
            COUNT(submissions.id) AS total_submissions,
            COUNT(submissions.id) FILTER (
                WHERE submissions.status = 'reviewed'
            ) AS reviewed_submissions
         FROM assignments
         JOIN subjects
            ON assignments.subject_id = subjects.id
         LEFT JOIN submissions
            ON assignments.id = submissions.assignment_id
         GROUP BY
            assignments.id,
            assignments.title,
            subjects.name
         ORDER BY assignments.created_at DESC`
    );

    return result.rows;
};