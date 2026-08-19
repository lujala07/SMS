import { Router } from 'express';

import {
    getAttendance,
    addAttendance,
    editAttendance,
    removeAttendance,
    getStudentAttendance,
    getMyTeacherSubjects,
    getSubjectStudents
} from '../controllers/attendanceController.js';

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
    authorizeRoles('admin', 'teacher'),
    getAttendance
);

router.get(
    '/teacher/subjects',
    authenticate,
    authorizeRoles('teacher'),
    getMyTeacherSubjects
);

router.get(
    '/teacher/subjects/:subjectId/students',
    authenticate,
    authorizeRoles('teacher'),
    getSubjectStudents
);

router.get(
    '/student/:studentId',
    authenticate,
    getStudentAttendance
);

router.post(
    '/',
    authenticate,
    authorizeRoles('teacher'),
    addAttendance
);

router.put(
    '/:id',
    authenticate,
    authorizeRoles('teacher'),
    editAttendance
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles('teacher'),
    removeAttendance
);

export default router;