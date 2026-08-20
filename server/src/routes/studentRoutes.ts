import { Router } from 'express';

import {
    getStudents,
    getMyStudentProfile,
    getMyStudentDashboard,
    addStudent,
    editStudent,
    removeStudent
} from '../controllers/studentController.js';

import {
    authenticate
} from '../middleware/authMiddleware.js';

import {
    authorizeRoles
} from '../middleware/roleMiddleware.js';

const router = Router();

router.get(
    '/me',
    authenticate,
    authorizeRoles('student'),
    getMyStudentProfile
);

router.get(
    '/me/dashboard',
    authenticate,
    authorizeRoles('student'),
    getMyStudentDashboard
);

router.get(
    '/',
    authenticate,
    authorizeRoles('admin'),
    getStudents
);

router.post(
    '/',
    authenticate,
    authorizeRoles('admin'),
    addStudent
);

router.put(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    editStudent
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    removeStudent
);

export default router;