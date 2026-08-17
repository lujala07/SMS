import { Request, Response } from 'express';

import {
    getAllSubmissions,
    createSubmission,
    reviewSubmission,
    getSubmissionsByAssignment,
    getSubmissionsByStudent
} from '../services/submissionService.js';

export const getSubmissions = async (
    _req: Request,
    res: Response
) => {
    try {
        const submissions = await getAllSubmissions();

        return res.status(200).json(submissions);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch submissions'
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

        if (!assignmentId || !studentId) {
            return res.status(400).json({
                message: 'Assignment and student are required'
            });
        }

        if (!submissionText && !fileUrl) {
            return res.status(400).json({
                message:
                    'Submission text or file URL is required'
            });
        }

        const submission = await createSubmission(
            Number(assignmentId),
            Number(studentId),
            submissionText,
            fileUrl,
            status || 'submitted'
        );

        return res.status(201).json(submission);
    } catch {
        return res.status(500).json({
            message: 'Failed to submit assignment'
        });
    }
};

export const gradeSubmission = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const {
            marksObtained,
            feedback
        } = req.body;

        if (marksObtained === undefined) {
            return res.status(400).json({
                message: 'Marks obtained are required'
            });
        }

        const submission = await reviewSubmission(
            id,
            Number(marksObtained),
            feedback
        );

        if (!submission) {
            return res.status(404).json({
                message: 'Submission not found'
            });
        }

        return res.status(200).json(submission);
    } catch {
        return res.status(500).json({
            message: 'Failed to review submission'
        });
    }
};

export const getAssignmentSubmissions = async (
    req: Request,
    res: Response
) => {
    try {
        const assignmentId =
            Number(req.params.assignmentId);

        const submissions =
            await getSubmissionsByAssignment(
                assignmentId
            );

        return res.status(200).json(submissions);
    } catch {
        return res.status(500).json({
            message:
                'Failed to fetch assignment submissions'
        });
    }
};

export const getStudentSubmissions = async (
    req: Request,
    res: Response
) => {
    try {
        const studentId =
            Number(req.params.studentId);

        const submissions =
            await getSubmissionsByStudent(studentId);

        return res.status(200).json(submissions);
    } catch {
        return res.status(500).json({
            message:
                'Failed to fetch student submissions'
        });
    }
};