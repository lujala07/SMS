import {
    Request,
    Response
} from 'express';

import {
    getAllStudents,
    getStudentByUserId,
    getStudentDashboardData,
    createStudent,
    updateStudent,
    deleteStudent
} from '../services/studentService.js';

export const getStudents = async (
    _req: Request,
    res: Response
) => {
    try {
        const students =
            await getAllStudents();

        return res.status(200).json(
            students
        );

    } catch (error) {
        console.error(
            'GET STUDENTS ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch students'
        });
    }
};

export const getMyStudentProfile = async (
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

        const student =
            await getStudentByUserId(
                req.user.userId
            );

        if (!student) {
            return res.status(404).json({
                message:
                    'Student profile not found'
            });
        }

        return res.status(200).json(
            student
        );

    } catch (error) {
        console.error(
            'GET STUDENT PROFILE ERROR:',
            error
        );

        return res.status(500).json({
            message:
                'Failed to fetch student profile'
        });
    }
};

export const getMyStudentDashboard = async (
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

        const dashboard =
            await getStudentDashboardData(
                req.user.userId
            );

        return res.status(200).json(
            dashboard
        );

    } catch (error: any) {
        console.error(
            'GET STUDENT DASHBOARD ERROR:',
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                'Failed to fetch student dashboard'
        });
    }
};

export const addStudent = async (
    req: Request,
    res: Response
) => {
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

        const student =
            await createStudent(
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

        return res.status(201).json(
            student
        );

    } catch (error: any) {
        console.error(
            'CREATE STUDENT ERROR:',
            error
        );

        if (error.code === '23505') {
            if (
                error.constraint ===
                'users_email_key'
            ) {
                return res.status(400).json({
                    message:
                        'Email already exists'
                });
            }

            if (
                error.constraint ===
                'students_student_code_key'
            ) {
                return res.status(400).json({
                    message:
                        'Student code already exists'
                });
            }

            return res.status(400).json({
                message:
                    'Duplicate student information'
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message:
                    'Selected class does not exist'
            });
        }

        return res.status(500).json({
            message:
                'Failed to create student'
        });
    }
};

export const editStudent = async (
    req: Request,
    res: Response
) => {
    try {
        const id =
            Number(req.params.id);

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

        const student =
            await updateStudent(
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
                message:
                    'Student not found'
            });
        }

        return res.status(200).json(
            student
        );

    } catch (error: any) {
        console.error(
            'UPDATE STUDENT ERROR:',
            error
        );

        if (error.code === '23505') {
            if (
                error.constraint ===
                'students_student_code_key'
            ) {
                return res.status(400).json({
                    message:
                        'Student code already exists'
                });
            }

            return res.status(400).json({
                message:
                    'Duplicate student information'
            });
        }

        if (error.code === '23503') {
            return res.status(400).json({
                message:
                    'Selected class does not exist'
            });
        }

        return res.status(500).json({
            message:
                'Failed to update student'
        });
    }
};

export const removeStudent = async (
    req: Request,
    res: Response
) => {
    try {
        const id =
            Number(req.params.id);

        const student =
            await deleteStudent(id);

        if (!student) {
            return res.status(404).json({
                message:
                    'Student not found'
            });
        }

        return res.status(200).json({
            message:
                'Student deleted successfully'
        });

    } catch (error: any) {
        console.error(
            'DELETE STUDENT ERROR:',
            error
        );

        if (error.code === '23503') {
            return res.status(409).json({
                message:
                    'Student cannot be deleted because related academic records exist'
            });
        }

        return res.status(500).json({
            message:
                'Failed to delete student'
        });
    }
};
