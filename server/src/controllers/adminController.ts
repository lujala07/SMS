import type {
    Request,
    Response
} from 'express';

import {
    createAdminUser
} from '../services/adminService.js';

export const createAdmin = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message:
                    'Email and password are required'
            });
        }

        const admin =
            await createAdminUser(
                email,
                password
            );

        return res.status(201).json({
            message:
                'Admin created successfully',
            admin
        });
    } catch (error: any) {
        console.error(error);

        if (error.code === '23505') {
            return res.status(400).json({
                message:
                    'Email already exists'
            });
        }

        return res.status(500).json({
            message:
                'Could not create admin'
        });
    }
};