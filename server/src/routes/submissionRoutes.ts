import { Router } from 'express';

import {
    getSubmissions,
    addSubmission,
    gradeSubmission,
    getAssignmentSubmissions,
    getStudentSubmissions
} from '../controllers/submissionController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.get(
    '/',
    authenticate,
    authorizeRoles('admin', 'teacher'),
    getSubmissions
);

router.get(
    '/assignment/:assignmentId',
    authenticate,
    authorizeRoles('admin', 'teacher'),
    getAssignmentSubmissions
);

router.get(
    '/student/:studentId',
    authenticate,
    getStudentSubmissions
);

router.post(
    '/',
    authenticate,
    authorizeRoles('student'),
    addSubmission
);

router.put(
    '/:id/review',
    authenticate,
    authorizeRoles('teacher'),
    gradeSubmission
);

export default router;