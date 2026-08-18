import { Request, Response } from 'express';

import {
    getAllTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher
} from '../services/teacherService.js';

export const getTeachers = async (
    _req: Request,
    res: Response
) => {
    try {
        const teachers = await getAllTeachers();

        return res.status(200).json(teachers);
    } catch (error) {
        console.error(
            'GET TEACHERS ERROR:',
            error
        );

        return res.status(500).json({
            message: 'Failed to fetch teachers'
        });
    }
};

export const addTeacher = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            email,
            password,
            departmentId,
            firstName,
            lastName,
            phoneNumber,
            address
        } = req.body;

        if (
            !email ||
            !password ||
            !firstName ||
            !lastName
        ) {
            return res.status(400).json({
                message:
                    'Email, password, first name and last name are required'
            });
        }

        const teacher = await createTeacher(
            email,
            password,
            departmentId
                ? Number(departmentId)
                : null,
            firstName,
            lastName,
            phoneNumber,
            address
        );

        return res.status(201).json({
            message: 'Teacher created successfully',
            teacher
        });

    } catch (error: any) {
        console.error(
            'CREATE TEACHER ERROR:',
            error
        );

        if (error.code === '23505') {
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message:
                    'Selected department does not exist'
            });
        }

        if (error.code === '23514') {
            return res.status(400).json({
                message: 'Invalid data provided'
            });
        }

        return res.status(500).json({
            message:
                error.message ||
                'Failed to create teacher'
        });
    }
};

export const editTeacher = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const {
            departmentId,
            firstName,
            lastName,
            phoneNumber,
            address
        } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({
                message:
                    'First name and last name are required'
            });
        }

        const teacher = await updateTeacher(
            id,
            departmentId
                ? Number(departmentId)
                : null,
            firstName,
            lastName,
            phoneNumber,
            address
        );

        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher not found'
            });
        }

        return res.status(200).json({
            message: 'Teacher updated successfully',
            teacher
        });

    } catch (error: any) {
        console.error(
            'UPDATE TEACHER ERROR:',
            error
        );

        if (error.code === '23503') {
            return res.status(400).json({
                message:
                    'Selected department does not exist'
            });
        }

        return res.status(500).json({
            message:
                error.message ||
                'Failed to update teacher'
        });
    }
};

export const removeTeacher = async (
    req: Request,
    res: Response
) => {
    try {
        const id = Number(req.params.id);

        const teacher = await deleteTeacher(id);

        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher not found'
            });
        }

        return res.status(200).json({
            message: 'Teacher deleted successfully'
        });

    } catch (error: any) {
        console.error(
            'DELETE TEACHER ERROR:',
            error
        );

        if (error.code === '23503') {
            return res.status(400).json({
                message:
                    'Teacher cannot be deleted because related records exist'
            });
        }

        return res.status(500).json({
            message:
                error.message ||
                'Failed to delete teacher'
        });
    }
};