import pool from '../config/database.js';
import { createNotifications, withNotificationTransaction } from './notificationService.js';

export const getAllSubmissions = async () => {
    const result = await pool.query(
        `
        SELECT
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
            assignments.total_marks,

            subjects.name AS subject_name,
            subjects.code AS subject_code,

            students.first_name,
            students.last_name,
            students.student_code

        FROM submissions

        JOIN assignments
            ON submissions.assignment_id = assignments.id

        JOIN subjects
            ON assignments.subject_id = subjects.id

        JOIN students
            ON submissions.student_id = students.id

        ORDER BY submissions.submitted_at DESC
        `
    );

    return result.rows;
};

export const getTeacherSubmissions = async (
    userId: number
) => {
    const result = await pool.query(
        `
        SELECT
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
            assignments.total_marks,

            subjects.name AS subject_name,
            subjects.code AS subject_code,

            students.first_name,
            students.last_name,
            students.student_code

        FROM submissions

        JOIN assignments
            ON submissions.assignment_id = assignments.id

        JOIN teachers
            ON assignments.teacher_id = teachers.id

        JOIN subjects
            ON assignments.subject_id = subjects.id

        JOIN students
            ON submissions.student_id = students.id

        WHERE teachers.user_id = $1

        ORDER BY submissions.submitted_at DESC
        `,
        [userId]
    );

    return result.rows;
};

export const getTeacherAssignmentsForSubmissions =
    async (
        userId: number
    ) => {
        const result = await pool.query(
            `
            SELECT
                assignments.id,
                assignments.title,
                assignments.subject_id,
                assignments.due_date,
                assignments.total_marks,

                subjects.name AS subject_name,
                subjects.code AS subject_code,

                classes.name AS class_name,
                classes.semester

            FROM assignments

            JOIN teachers
                ON assignments.teacher_id = teachers.id

            JOIN subjects
                ON assignments.subject_id = subjects.id

            JOIN classes
                ON subjects.class_id = classes.id

            WHERE teachers.user_id = $1

            ORDER BY assignments.created_at DESC
            `,
            [userId]
        );

        return result.rows;
    };

export const getAssignmentStudentList = async (
    userId: number,
    assignmentId: number
) => {
    const assignmentResult =
        await pool.query(
            `
            SELECT
                assignments.id,
                assignments.title,
                assignments.total_marks,
                subjects.class_id

            FROM assignments

            JOIN teachers
                ON assignments.teacher_id = teachers.id

            JOIN subjects
                ON assignments.subject_id = subjects.id

            WHERE assignments.id = $1
            AND teachers.user_id = $2
            `,
            [
                assignmentId,
                userId
            ]
        );

    const assignment =
        assignmentResult.rows[0];

    if (!assignment) {
        throw new Error(
            'Assignment not found or you cannot access it'
        );
    }

    const result = await pool.query(
        `
        SELECT
            students.id AS student_id,
            students.student_code,
            students.first_name,
            students.last_name,

            submissions.id AS submission_id,
            submissions.submission_text,
            submissions.file_url,
            submissions.submitted_at,
            submissions.marks_obtained,
            submissions.feedback,
            submissions.status,

            $2::INTEGER AS assignment_id,
            $3::VARCHAR AS assignment_title,
            $4::NUMERIC AS total_marks

        FROM students

        LEFT JOIN submissions
            ON submissions.student_id = students.id
            AND submissions.assignment_id = $2

        WHERE students.class_id = $1

        ORDER BY
            students.first_name,
            students.last_name
        `,
        [
            assignment.class_id,
            assignment.id,
            assignment.title,
            assignment.total_marks
        ]
    );

    return result.rows;
};

export const createStudentSubmission = async (
    userId: number,
    assignmentId: number,
    submissionText?: string,
    fileUrl?: string
) => {
    return withNotificationTransaction(async client => {
        const studentResult =
            await client.query(
                `
                SELECT
                    students.id,
                    students.class_id

                FROM students

                WHERE students.user_id = $1
                `,
                [userId]
            );

        const student =
            studentResult.rows[0];

        if (!student) {
            throw new Error(
                'Student profile not found'
            );
        }

        const assignmentResult =
            await client.query(
                `
                SELECT
                    assignments.id,
                    assignments.due_date,
                    subjects.class_id

                FROM assignments

                JOIN subjects
                    ON assignments.subject_id = subjects.id

                WHERE assignments.id = $1
                `,
                [assignmentId]
            );

        const assignment =
            assignmentResult.rows[0];

        if (!assignment) {
            throw new Error(
                'Assignment not found'
            );
        }

        if (
            Number(assignment.class_id) !==
            Number(student.class_id)
        ) {
            throw new Error(
                'This assignment does not belong to your class'
            );
        }

        const dueDate =
            new Date(
                assignment.due_date
            );

        const now =
            new Date();

        const status =
            now > dueDate
                ? 'late'
                : 'submitted';

        const result = await client.query(
            `
            INSERT INTO submissions (
                assignment_id,
                student_id,
                submission_text,
                file_url,
                status
            )

            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5
            )

            RETURNING *
            `,
            [
                assignmentId,
                student.id,
                submissionText || null,
                fileUrl || null,
                status
            ]
        );

        const recipients = await client.query(
            'SELECT teachers.user_id, assignments.title FROM assignments JOIN teachers ON assignments.teacher_id = teachers.id WHERE assignments.id = $1',
            [assignmentId]
        );
        const notifications = await createNotifications(client, recipients.rows.map(teacher => teacher.user_id), 'New submission', `A student submitted ${recipients.rows[0].title}.`, '/teacher/submissions');
        return { value: result.rows[0], notifications };
    });
};

export const reviewSubmission = async (
    userId: number,
    id: number,
    marksObtained: number,
    feedback?: string
) => {
    return withNotificationTransaction(async client => {
        const submissionResult =
            await client.query(
                `
                SELECT
                    submissions.id,
                    assignments.total_marks

                FROM submissions

                JOIN assignments
                    ON submissions.assignment_id =
                       assignments.id

                JOIN teachers
                    ON assignments.teacher_id =
                       teachers.id

                WHERE submissions.id = $1
                AND teachers.user_id = $2
                `,
                [
                    id,
                    userId
                ]
            );

        const submission =
            submissionResult.rows[0];

        if (!submission) {
            throw new Error(
                'Submission not found or you cannot review it'
            );
        }

        if (
            marksObtained < 0 ||
            marksObtained >
                Number(
                    submission.total_marks
                )
        ) {
            throw new Error(
                `Marks must be between 0 and ${submission.total_marks}`
            );
        }

        const result =
            await client.query(
                `
                UPDATE submissions

                SET
                    marks_obtained = $1,
                    feedback = $2,
                    status = 'reviewed'

                WHERE id = $3

                RETURNING *
                `,
                [
                    marksObtained,
                    feedback || null,
                    id
                ]
            );

        const recipients = await client.query(
            'SELECT students.user_id, assignments.title FROM submissions JOIN students ON submissions.student_id = students.id JOIN assignments ON submissions.assignment_id = assignments.id WHERE submissions.id = $1',
            [id]
        );
        const notifications = await createNotifications(client, recipients.rows.map(student => student.user_id), 'Submission reviewed', `Your submission for ${recipients.rows[0].title} has been reviewed.`, '/student/assignments');
        return { value: result.rows[0], notifications };
    });
};

export const getSubmissionsByAssignment =
    async (
        assignmentId: number
    ) => {
        const result =
            await pool.query(
                `
                SELECT
                    submissions.*,

                    students.first_name,
                    students.last_name,
                    students.student_code,

                    assignments.total_marks

                FROM submissions

                JOIN students
                    ON submissions.student_id =
                       students.id

                JOIN assignments
                    ON submissions.assignment_id =
                       assignments.id

                WHERE submissions.assignment_id = $1

                ORDER BY submissions.submitted_at DESC
                `,
                [assignmentId]
            );

        return result.rows;
    };

export const getSubmissionsByStudent =
    async (
        studentId: number
    ) => {
        const result =
            await pool.query(
                `
                SELECT
                    submissions.*,

                    assignments.title
                        AS assignment_title,

                    assignments.total_marks,

                    subjects.name
                        AS subject_name,

                    subjects.code
                        AS subject_code

                FROM submissions

                JOIN assignments
                    ON submissions.assignment_id =
                       assignments.id

                JOIN subjects
                    ON assignments.subject_id =
                       subjects.id

                WHERE submissions.student_id = $1

                ORDER BY submissions.submitted_at DESC
                `,
                [studentId]
            );

        return result.rows;
    };
