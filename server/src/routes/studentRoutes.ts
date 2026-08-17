import { Router } from 'express';

import {
    getStudents,
    addStudent,
    editStudent,
    removeStudent
} from '../controllers/studentController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

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