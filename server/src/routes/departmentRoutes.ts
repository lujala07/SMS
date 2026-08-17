import { Router } from 'express';
import {
    getDepartments,
    addDepartment,
    editDepartment,
    removeDepartment
} from '../controllers/departmentController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.get(
    '/',
    authenticate,
    getDepartments
);

router.post(
    '/',
    authenticate,
    authorizeRoles('admin'),
    addDepartment
);

router.put(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    editDepartment
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    removeDepartment
);

export default router;