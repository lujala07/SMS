import { Router } from 'express';

import {
    dashboardSummary,
    attendanceSummary,
    studentAttendanceReport,
    assignmentSummary
} from '../controllers/reportController.js';

import {
    authenticate
} from '../middleware/authMiddleware.js';

import {
    authorizeRoles
} from '../middleware/roleMiddleware.js';

const router = Router();

router.get(
    '/dashboard',
    authenticate,
    authorizeRoles('admin'),
    dashboardSummary
);

router.get(
    '/attendance',
    authenticate,
    authorizeRoles(
        'admin',
        'teacher'
    ),
    attendanceSummary
);

router.get(
    '/attendance/student/:studentId',
    authenticate,
    studentAttendanceReport
);

router.get(
    '/assignments',
    authenticate,
    authorizeRoles(
        'admin',
        'teacher'
    ),
    assignmentSummary
);

export default router;