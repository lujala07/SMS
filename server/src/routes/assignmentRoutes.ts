import { Router } from 'express';

import {
    getAssignments,
    addAssignment,
    editAssignment,
    removeAssignment,
    getSubjectAssignments,
    getMyAssignmentSubjects
} from '../controllers/assignmentController.js';

import {
    authenticate
} from '../middleware/authMiddleware.js';

import {
    authorizeRoles
} from '../middleware/roleMiddleware.js';

const router = Router();

router.get(
    '/',
    authenticate,
    getAssignments
);

router.get(
    '/teacher/subjects',
    authenticate,
    authorizeRoles('teacher'),
    getMyAssignmentSubjects
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