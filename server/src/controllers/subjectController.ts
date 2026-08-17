import { Request, Response } from 'express';
import {
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject
} from '../services/subjectService.js';

export const getSubjects = async (_req: Request, res: Response) => {
    try {
        const subjects = await getAllSubjects();

        return res.status(200).json(subjects);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch subjects'
        });
    }
};

export const addSubject = async (req: Request, res: Response) => {
    try {
        const {
            classId,
            name,
            code
        } = req.body;

        if (!classId || !name || !code) {
            return res.status(400).json({
                message: 'Class, name and code are required'
            });
        }

        const subject = await createSubject(
            Number(classId),
            name,
            code
        );

        return res.status(201).json(subject);
    } catch {
        return res.status(500).json({
            message: 'Failed to create subject'
        });
    }
};

export const editSubject = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const {
            classId,
            name,
            code
        } = req.body;

        if (!classId || !name || !code) {
            return res.status(400).json({
                message: 'Class, name and code are required'
            });
        }

        const updatedSubject = await updateSubject(
            id,
            Number(classId),
            name,
            code
        );

        if (!updatedSubject) {
            return res.status(404).json({
                message: 'Subject not found'
            });
        }

        return res.status(200).json(updatedSubject);
    } catch {
        return res.status(500).json({
            message: 'Failed to update subject'
        });
    }
};

export const removeSubject = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const deletedSubject = await deleteSubject(id);

        if (!deletedSubject) {
            return res.status(404).json({
                message: 'Subject not found'
            });
        }

        return res.status(200).json({
            message: 'Subject deleted successfully'
        });
    } catch {
        return res.status(500).json({
            message: 'Failed to delete subject'
        });
    }
};