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
            students.student_code,

            subjects.name AS subject_name,
            subjects.code AS subject_code,

            teachers.first_name AS teacher_first_name,
            teachers.last_name AS teacher_last_name

         FROM attendance

         JOIN students
            ON attendance.student_id = students.id

         JOIN subjects
            ON attendance.subject_id = subjects.id

         JOIN teachers
            ON attendance.marked_by = teachers.id

         ORDER BY attendance.attendance_date DESC,
                  students.first_name`
    );

    return result.rows;
};

export const getTeacherAttendance = async (
    userId: number
) => {
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
            students.student_code,

            subjects.name AS subject_name,
            subjects.code AS subject_code

         FROM attendance

         JOIN students
            ON attendance.student_id = students.id

         JOIN subjects
            ON attendance.subject_id = subjects.id

         JOIN teachers
            ON attendance.marked_by = teachers.id

         WHERE teachers.user_id = $1

         ORDER BY attendance.attendance_date DESC,
                  students.first_name`,
        [userId]
    );

    return result.rows;
};

export const getTeacherSubjects = async (
    userId: number
) => {
    const result = await pool.query(
        `SELECT
            subjects.id AS subject_id,
            subjects.name AS subject_name,
            subjects.code AS subject_code,

            classes.id AS class_id,
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

         ORDER BY subjects.name`,
        [userId]
    );

    return result.rows;
};

export const getStudentsForTeacherSubject = async (
    userId: number,
    subjectId: number
) => {
    const result = await pool.query(
        `SELECT
            students.id,
            students.student_code,
            students.first_name,
            students.last_name,
            students.class_id

         FROM students

         JOIN subjects
            ON students.class_id = subjects.class_id

         JOIN teacher_subjects
            ON teacher_subjects.subject_id = subjects.id

         JOIN teachers
            ON teacher_subjects.teacher_id = teachers.id

         WHERE teachers.user_id = $1
         AND subjects.id = $2

         ORDER BY students.first_name,
                  students.last_name`,
        [userId, subjectId]
    );

    return result.rows;
};

export const createAttendance = async (
    userId: number,
    studentId: number,
    subjectId: number,
    status: string,
    attendanceDate?: string
) => {
    const teacherResult = await pool.query(
        `SELECT
            teachers.id

         FROM teachers

         JOIN teacher_subjects
            ON teacher_subjects.teacher_id = teachers.id

         WHERE teachers.user_id = $1
         AND teacher_subjects.subject_id = $2`,
        [userId, subjectId]
    );

    const teacher = teacherResult.rows[0];

    if (!teacher) {
        throw new Error(
            'You are not assigned to this subject'
        );
    }

    const studentResult = await pool.query(
        `SELECT students.id
         FROM students
         JOIN subjects
            ON students.class_id = subjects.class_id
         WHERE students.id = $1
         AND subjects.id = $2`,
        [studentId, subjectId]
    );

    if (!studentResult.rows[0]) {
        throw new Error(
            'Student does not belong to this subject class'
        );
    }

    const result = await pool.query(
        `INSERT INTO attendance (
            student_id,
            subject_id,
            marked_by,
            attendance_date,
            status
        )

        VALUES (
            $1,
            $2,
            $3,
            COALESCE($4, CURRENT_DATE),
            $5
        )

        ON CONFLICT (
            student_id,
            subject_id,
            attendance_date
        )

        DO UPDATE SET
            status = EXCLUDED.status,
            marked_by = EXCLUDED.marked_by

        RETURNING *`,
        [
            studentId,
            subjectId,
            teacher.id,
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

export const deleteAttendance = async (
    id: number
) => {
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