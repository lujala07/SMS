import {
    Request,
    Response
} from 'express';

import {
    getAllAssignments,
    getTeacherAssignments,
    getTeacherSubjectsForAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentsBySubject
} from '../services/assignmentService.js';

export const getAssignments = async (
    req: Request,
    res: Response
) => {
    try {
        if (
            req.user?.role === 'teacher' &&
            req.user.userId
        ) {
            const assignments =
                await getTeacherAssignments(
                    req.user.userId
                );

            return res.status(200).json(
                assignments
            );
        }

        const assignments =
            await getAllAssignments();

        return res.status(200).json(
            assignments
        );

    } catch (error) {
        console.error(
            'GET ASSIGNMENTS ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch assignments'
        });
    }
};

export const getMyAssignmentSubjects = async (
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

        const subjects =
            await getTeacherSubjectsForAssignments(
                req.user.userId
            );

        return res.status(200).json(
            subjects
        );

    } catch (error) {
        console.error(
            'GET ASSIGNMENT SUBJECTS ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch teacher subjects'
        });
    }
};

export const addAssignment = async (
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

        const {
            subjectId,
            title,
            description,
            dueDate,
            totalMarks
        } = req.body;

        if (
            !subjectId ||
            !title ||
            !dueDate ||
            totalMarks === undefined
        ) {
            return res.status(400).json({
                message:
                    'Subject, title, due date and total marks are required'
            });
        }

        if (Number(totalMarks) <= 0) {
            return res.status(400).json({
                message:
                    'Total marks must be greater than zero'
            });
        }

        const assignment =
            await createAssignment(
                req.user.userId,
                Number(subjectId),
                title,
                description,
                dueDate,
                Number(totalMarks)
            );

        return res.status(201).json({
            message:
                'Assignment created successfully',
            assignment
        });

    } catch (error: any) {
        console.error(
            'CREATE ASSIGNMENT ERROR:',
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                'Failed to create assignment'
        });
    }
};

export const editAssignment = async (
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
            subjectId,
            title,
            description,
            dueDate,
            totalMarks
        } = req.body;

        if (
            !subjectId ||
            !title ||
            !dueDate ||
            totalMarks === undefined
        ) {
            return res.status(400).json({
                message:
                    'Subject, title, due date and total marks are required'
            });
        }

        const assignment =
            await updateAssignment(
                req.user.userId,
                id,
                Number(subjectId),
                title,
                description,
                dueDate,
                Number(totalMarks)
            );

        if (!assignment) {
            return res.status(404).json({
                message:
                    'Assignment not found or you cannot edit it'
            });
        }

        return res.status(200).json({
            message:
                'Assignment updated successfully',
            assignment
        });

    } catch (error: any) {
        console.error(
            'UPDATE ASSIGNMENT ERROR:',
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                'Failed to update assignment'
        });
    }
};

export const removeAssignment = async (
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

        const assignment =
            await deleteAssignment(
                req.user.userId,
                id
            );

        if (!assignment) {
            return res.status(404).json({
                message:
                    'Assignment not found or you cannot delete it'
            });
        }

        return res.status(200).json({
            message:
                'Assignment deleted successfully'
        });

    } catch (error: any) {
        console.error(
            'DELETE ASSIGNMENT ERROR:',
            error
        );

        if (error.code === '23503') {
            return res.status(400).json({
                message:
                    'Assignment cannot be deleted because submissions already exist'
            });
        }

        return res.status(500).json({
            message:
                'Failed to delete assignment'
        });
    }
};

export const getSubjectAssignments = async (
    req: Request,
    res: Response
) => {
    try {
        const subjectId =
            Number(req.params.subjectId);

        const assignments =
            await getAssignmentsBySubject(
                subjectId
            );

        return res.status(200).json(
            assignments
        );

    } catch (error) {
        console.error(
            'GET SUBJECT ASSIGNMENTS ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch subject assignments'
        });
    }
};