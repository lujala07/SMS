import { Router } from 'express';
import {
    getClasses,
    addClass,
    editClass,
    removeClass
} from '../controllers/classController.js';

import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.get(
    '/',
    authenticate,
    getClasses
);

router.post(
    '/',
    authenticate,
    authorizeRoles('admin'),
    addClass
);

router.put(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    editClass
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    removeClass
);

export default router;