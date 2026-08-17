import { Router } from 'express';

import {
    getTeachers,
    addTeacher,
    editTeacher,
    removeTeacher
} from '../controllers/teacherController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.get(
    '/',
    authenticate,
    authorizeRoles('admin'),
    getTeachers
);

router.post(
    '/',
    authenticate,
    authorizeRoles('admin'),
    addTeacher
);

router.put(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    editTeacher
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    removeTeacher
);

export default router;