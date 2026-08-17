import { Router } from 'express';
import {
    getSubjects,
    addSubject,
    editSubject,
    removeSubject
} from '../controllers/subjectController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.get(
    '/',
    authenticate,
    getSubjects
);

router.post(
    '/',
    authenticate,
    authorizeRoles('admin'),
    addSubject
);

router.put(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    editSubject
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    removeSubject
);

export default router;