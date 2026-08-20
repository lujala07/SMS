import { Request, Response } from 'express';
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../services/departmentService.js';

export const getDepartments = async (_req: Request, res: Response) => {
    try {
        const departments = await getAllDepartments();

        return res.status(200).json(departments);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch departments'
        });
    }
};

export const addDepartment = async (req: Request, res: Response) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                message: 'Name and code are required'
            });
        }

        const department = await createDepartment(name, code);

        return res.status(201).json(department);
    } catch {
        return res.status(500).json({
            message: 'Failed to create department'
        });
    }
};

export const editDepartment = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                message: 'Name and code are required'
            });
        }

        const department = await updateDepartment(id, name, code);

        if (!department) {
            return res.status(404).json({
                message: 'Department not found'
            });
        }

        return res.status(200).json(department);
    } catch {
        return res.status(500).json({
            message: 'Failed to update department'
        });
    }
};

export const removeDepartment = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const department = await deleteDepartment(id);

        if (!department) {
            return res.status(404).json({
                message: 'Department not found'
            });
        }

        return res.status(200).json({
            message: 'Department deleted successfully'
        });
    } catch (error: any) {
        if (error.code === '23503') {
            return res.status(409).json({
                message:
                    'Department cannot be deleted because related records exist'
            });
        }

        return res.status(500).json({
            message: 'Failed to delete department'
        });
    }
};
