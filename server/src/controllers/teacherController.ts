import { Request, Response } from 'express';
import { mobileError, normalizeNepalMobile } from '../utils/phone.js';
import { InvitationError } from '../services/invitationService.js';

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
            departmentId,
            firstName,
            lastName,
            phoneNumber,
            address
        } = req.body ?? {};

        const requiredStrings = [email, firstName, lastName, phoneNumber, address];
        if (requiredStrings.some(value => typeof value !== 'string' || !value.trim())) {
            return res.status(400).json({ message: 'All required fields must be non-empty strings' });
        }
        if (email.trim().length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({ message: 'A valid email address is required' });
        }
        if (typeof departmentId !== 'number' || !Number.isInteger(departmentId) || departmentId <= 0 || departmentId > 2147483647) {
            return res.status(400).json({ message: 'A valid department is required' });
        }
        if (firstName.trim().length > 100 || lastName.trim().length > 100 || phoneNumber.trim().length > 20) {
            return res.status(400).json({ message: 'Names must be at most 100 characters and phone number at most 20 characters' });
        }

        if (
            !String(email || '').trim() ||
            !departmentId ||
            !String(firstName || '').trim() ||
            !String(lastName || '').trim() ||
            !String(phoneNumber || '').trim() ||
            !String(address || '').trim()
        ) {
            return res.status(400).json({
                message:
                    'Email, first name, last name, phone number, address and department are required'
            });
        }

        const mobile = normalizeNepalMobile(phoneNumber);
        if (!mobile) return res.status(400).json({ message: mobileError });

        const teacher = await createTeacher(
            String(email).trim(),
            Number(departmentId),
            String(firstName).trim(),
            String(lastName).trim(),
            mobile,
            String(address).trim()
        );

        return res.status(201).json({
            message: 'Teacher created and invitation email sent',
            teacher
        });

    } catch (error: any) {
        if (error instanceof InvitationError) {
            return res.status(error.status).json({ message: error.message });
        }
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

        const mobile = normalizeNepalMobile(phoneNumber);
        if (!mobile) return res.status(400).json({ message: mobileError });

        const teacher = await updateTeacher(
            id,
            departmentId
                ? Number(departmentId)
                : null,
            firstName,
            lastName,
            mobile,
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
            return res.status(409).json({
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
