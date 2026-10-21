import {
    Request,
    Response
} from 'express';
import { validateDate } from '../utils/dateValidation.js';
import { mobileError, normalizeNepalMobile } from '../utils/phone.js';
import { InvitationError } from '../services/invitationService.js';

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
            classId,
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            address,
            gender
        } = req.body ?? {};

        const requiredStrings = [email, firstName, lastName, phoneNumber, address, gender];
        if (requiredStrings.some(value => typeof value !== 'string' || !value.trim())) {
            return res.status(400).json({ message: 'All required fields must be non-empty strings' });
        }

        if (email.trim().length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({ message: 'A valid email address is required' });
        }

        if (typeof classId !== 'number' || !Number.isSafeInteger(classId) || classId <= 0 || classId > 2147483647) {
            return res.status(400).json({ message: 'Class must be a positive integer' });
        }

        if (firstName.trim().length > 100 || lastName.trim().length > 100 || phoneNumber.trim().length > 20) {
            return res.status(400).json({ message: 'Names must be at most 100 characters and phone number at most 20 characters' });
        }

        if (!['male', 'female', 'other'].includes(gender.trim())) {
            return res.status(400).json({ message: 'Gender must be male, female, or other' });
        }

        const dateError = validateDate(dateOfBirth, 'Date of birth', 'past', true);
        if (dateError) return res.status(400).json({ message: dateError });

        const mobile = normalizeNepalMobile(phoneNumber);
        if (!mobile) return res.status(400).json({ message: mobileError });

        const student =
            await createStudent(
                email.trim(),
                classId,
                firstName.trim(),
                lastName.trim(),
                dateOfBirth,
                mobile,
                address.trim(),
                gender.trim()
            );

        return res.status(201).json(
            student
        );

    } catch (error: any) {
        if (error instanceof InvitationError) {
            return res.status(error.status).json({ message: error.message });
        }
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
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            address,
            gender
        } = req.body;

        if (
            !classId ||
            !firstName ||
            !lastName
        ) {
            return res.status(400).json({
                message:
                    'Class, first name and last name are required'
            });
        }

        const dateError = validateDate(dateOfBirth, 'Date of birth', 'past', true);
        if (dateError) return res.status(400).json({ message: dateError });

        const mobile = normalizeNepalMobile(phoneNumber);
        if (!mobile) return res.status(400).json({ message: mobileError });

        const student =
            await updateStudent(
                id,
                Number(classId),
                firstName,
                lastName,
                dateOfBirth,
                mobile,
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
