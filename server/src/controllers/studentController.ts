import { Request, Response } from 'express';

import {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent
} from '../services/studentService.js';

export const getStudents = async (_req: Request, res: Response) => {
    try {
        const students = await getAllStudents();

        return res.status(200).json(students);
    } catch {
        return res.status(500).json({
            message: 'Failed to fetch students'
        });
    }
};

export const addStudent = async (req: Request, res: Response) => {
    try {
        const {
            email,
            password,
            classId,
            studentCode,
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            address,
            gender
        } = req.body;

        if (
            !email ||
            !password ||
            !classId ||
            !studentCode ||
            !firstName ||
            !lastName
        ) {
            return res.status(400).json({
                message:
                    'Email, password, class, student code, first name and last name are required'
            });
        }

        const student = await createStudent(
            email,
            password,
            Number(classId),
            studentCode,
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            address,
            gender
        );

        return res.status(201).json(student);
    } catch {
        return res.status(500).json({
            message: 'Failed to create student'
        });
    }
};

export const editStudent = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const {
            classId,
            studentCode,
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            address,
            gender
        } = req.body;

        if (
            !classId ||
            !studentCode ||
            !firstName ||
            !lastName
        ) {
            return res.status(400).json({
                message:
                    'Class, student code, first name and last name are required'
            });
        }

        const student = await updateStudent(
            id,
            Number(classId),
            studentCode,
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            address,
            gender
        );

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        return res.status(200).json(student);
    } catch {
        return res.status(500).json({
            message: 'Failed to update student'
        });
    }
};

export const removeStudent = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const student = await deleteStudent(id);

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        return res.status(200).json({
            message: 'Student deleted successfully'
        });
    } catch {
        return res.status(500).json({
            message: 'Failed to delete student'
        });
    }
};