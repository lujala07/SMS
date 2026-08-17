import { Router } from 'express';

import {
    getTeacherSubjects,
    addTeacherSubject,
    removeTeacherSubjectAssignment
} from '../controllers/teacherSubjectController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.get(
    '/',
    authenticate,
    authorizeRoles('admin'),
    getTeacherSubjects
);

router.post(
    '/',
    authenticate,
    authorizeRoles('admin'),
    addTeacherSubject
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    removeTeacherSubjectAssignment
);

export default router;