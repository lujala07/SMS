import { Request, Response } from 'express';
import {
    getAllClasses,
    createClass,
    updateClass,
    deleteClass
} from '../services/classService.js';

export const getClasses = async (_req: Request, res: Response) => {
    try {
        const classes = await getAllClasses();

        return res.status(200).json(classes);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch classes'
        });
    }
};

export const addClass = async (req: Request, res: Response) => {
    try {
        const {
            departmentId,
            name,
            semester,
            academicYear
        } = req.body;

        if (!departmentId || !name || !academicYear) {
            return res.status(400).json({
                message: 'Department, name and academic year are required'
            });
        }

        const newClass = await createClass(
            Number(departmentId),
            name,
            Number(semester),
            academicYear
        );

        return res.status(201).json(newClass);
    } catch {
        return res.status(500).json({
            message: 'Failed to create class'
        });
    }
};

export const editClass = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const {
            departmentId,
            name,
            semester,
            academicYear
        } = req.body;

        if (!departmentId || !name || !academicYear) {
            return res.status(400).json({
                message: 'Department, name and academic year are required'
            });
        }

        const updatedClass = await updateClass(
            id,
            Number(departmentId),
            name,
            Number(semester),
            academicYear
        );

        if (!updatedClass) {
            return res.status(404).json({
                message: 'Class not found'
            });
        }

        return res.status(200).json(updatedClass);
    } catch {
        return res.status(500).json({
            message: 'Failed to update class'
        });
    }
};

export const removeClass = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const deletedClass = await deleteClass(id);

        if (!deletedClass) {
            return res.status(404).json({
                message: 'Class not found'
            });
        }

        return res.status(200).json({
            message: 'Class deleted successfully'
        });
    } catch {
        return res.status(500).json({
            message: 'Failed to delete class'
        });
    }
};