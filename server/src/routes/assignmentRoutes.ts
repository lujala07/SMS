import { Router } from 'express';

import {
    getAssignments,
    addAssignment,
    editAssignment,
    removeAssignment,
    getSubjectAssignments
} from '../controllers/assignmentController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.get(
    '/',
    authenticate,
    getAssignments
);

router.get(
    '/subject/:subjectId',
    authenticate,
    getSubjectAssignments
);

router.post(
    '/',
    authenticate,
    authorizeRoles('teacher'),
    addAssignment
);

router.put(
    '/:id',
    authenticate,
    authorizeRoles('teacher'),
    editAssignment
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles('teacher'),
    removeAssignment
);

export default router;