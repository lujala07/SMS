import {
    Request,
    Response
} from 'express';

import {
    getAllSubmissions,
    getTeacherSubmissions,
    getTeacherAssignmentsForSubmissions,
    getAssignmentStudentList,
    createSubmission,
    reviewSubmission,
    getSubmissionsByAssignment,
    getSubmissionsByStudent
} from '../services/submissionService.js';

export const getSubmissions = async (
    req: Request,
    res: Response
) => {
    try {
        if (
            req.user?.role === 'teacher' &&
            req.user.userId
        ) {
            const submissions =
                await getTeacherSubmissions(
                    req.user.userId
                );

            return res.status(200).json(
                submissions
            );
        }

        const submissions =
            await getAllSubmissions();

        return res.status(200).json(
            submissions
        );

    } catch (error) {
        console.error(
            'GET SUBMISSIONS ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch submissions'
        });
    }
};

export const getMySubmissionAssignments =
    async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.user?.userId) {
                return res.status(401).json({
                    message:
                        'Authentication required'
                });
            }

            const assignments =
                await getTeacherAssignmentsForSubmissions(
                    req.user.userId
                );

            return res.status(200).json(
                assignments
            );

        } catch (error) {
            console.error(
                'GET TEACHER ASSIGNMENTS ERROR:',
                error
            );

            return res.status(500).json({
                message:
                    'Failed to fetch assignments'
            });
        }
    };

export const getAssignmentStudents =
    async (
        req: Request,
        res: Response
    ) => {
        try {
            if (!req.user?.userId) {
                return res.status(401).json({
                    message:
                        'Authentication required'
                });
            }

            const assignmentId =
                Number(
                    req.params.assignmentId
                );

            if (!assignmentId) {
                return res.status(400).json({
                    message:
                        'Valid assignment is required'
                });
            }

            const students =
                await getAssignmentStudentList(
                    req.user.userId,
                    assignmentId
                );

            return res.status(200).json(
                students
            );

        } catch (error: any) {
            console.error(
                'GET ASSIGNMENT STUDENTS ERROR:',
                error
            );

            return res.status(400).json({
                message:
                    error.message ||
                    'Failed to fetch students'
            });
        }
    };

export const addSubmission = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            assignmentId,
            studentId,
            submissionText,
            fileUrl,
            status
        } = req.body;

        if (
            !assignmentId ||
            !studentId
        ) {
            return res.status(400).json({
                message:
                    'Assignment and student are required'
            });
        }

        if (
            !submissionText &&
            !fileUrl
        ) {
            return res.status(400).json({
                message:
                    'Submission text or file URL is required'
            });
        }

        const submission =
            await createSubmission(
                Number(assignmentId),
                Number(studentId),
                submissionText,
                fileUrl,
                status || 'submitted'
            );

        return res.status(201).json(
            submission
        );

    } catch (error: any) {
        console.error(
            'CREATE SUBMISSION ERROR:',
            error
        );

        if (error.code === '23505') {
            return res.status(400).json({
                message:
                    'This assignment has already been submitted'
            });
        }

        return res.status(500).json({
            message:
                'Failed to submit assignment'
        });
    }
};

export const gradeSubmission = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                message:
                    'Authentication required'
            });
        }

        const id =
            Number(req.params.id);

        const {
            marksObtained,
            feedback
        } = req.body;

        if (
            marksObtained === undefined ||
            marksObtained === ''
        ) {
            return res.status(400).json({
                message:
                    'Marks obtained are required'
            });
        }

        const marks =
            Number(marksObtained);

        if (
            Number.isNaN(marks) ||
            marks < 0
        ) {
            return res.status(400).json({
                message:
                    'Marks must be a valid number'
            });
        }

        const submission =
            await reviewSubmission(
                req.user.userId,
                id,
                marks,
                feedback
            );

        return res.status(200).json({
            message:
                'Submission reviewed successfully',
            submission
        });

    } catch (error: any) {
        console.error(
            'REVIEW SUBMISSION ERROR:',
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                'Failed to review submission'
        });
    }
};

export const getAssignmentSubmissions =
    async (
        req: Request,
        res: Response
    ) => {
        try {
            const assignmentId =
                Number(
                    req.params.assignmentId
                );

            const submissions =
                await getSubmissionsByAssignment(
                    assignmentId
                );

            return res.status(200).json(
                submissions
            );

        } catch (error) {
            return res.status(500).json({
                message:
                    'Failed to fetch assignment submissions'
            });
        }
    };

export const getStudentSubmissions =
    async (
        req: Request,
        res: Response
    ) => {
        try {
            const studentId =
                Number(
                    req.params.studentId
                );

            const submissions =
                await getSubmissionsByStudent(
                    studentId
                );

            return res.status(200).json(
                submissions
            );

        } catch (error) {
            return res.status(500).json({
                message:
                    'Failed to fetch student submissions'
            });
        }
    };