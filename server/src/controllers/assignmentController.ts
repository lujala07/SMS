import { Request, Response } from 'express';

import {
    getAllAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentsBySubject
} from '../services/assignmentService.js';

export const getAssignments = async (
    _req: Request,
    res: Response
) => {
    try {
        const assignments = await getAllAssignments();

        return res.status(200).json(assignments);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch assignments'
        });
    }
};

export const addAssignment = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            subjectId,
            teacherId,
            title,
            description,
            dueDate,
            totalMarks
        } = req.body;

        if (
            !subjectId ||
            !teacherId ||
            !title ||
            !dueDate ||
            totalMarks === undefined
        ) {
            return res.status(400).json({
                message:
                    'Subject, teacher, title, due date and total marks are required'
            });
        }

        const assignment = await createAssignment(
            Number(subjectId),
            Number(teacherId),
            title,
            description,
            dueDate,
            Number(totalMarks)
        );

        return res.status(201).json(assignment);
    } catch {
        return res.status(500).json({
            message: 'Failed to create assignment'
        });
    }
};

export const editAssignment = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

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

        const assignment = await updateAssignment(
            id,
            Number(subjectId),
            title,
            description,
            dueDate,
            Number(totalMarks)
        );

        if (!assignment) {
            return res.status(404).json({
                message: 'Assignment not found'
            });
        }

        return res.status(200).json(assignment);
    } catch {
        return res.status(500).json({
            message: 'Failed to update assignment'
        });
    }
};

export const removeAssignment = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const assignment = await deleteAssignment(id);

        if (!assignment) {
            return res.status(404).json({
                message: 'Assignment not found'
            });
        }

        return res.status(200).json({
            message: 'Assignment deleted successfully'
        });
    } catch {
        return res.status(500).json({
            message: 'Failed to delete assignment'
        });
    }
};

export const getSubjectAssignments = async (
    req: Request,
    res: Response
) => {
    try {
        const subjectId = Number(req.params.subjectId);

        const assignments =
            await getAssignmentsBySubject(subjectId);

        return res.status(200).json(assignments);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch subject assignments'
        });
    }
};