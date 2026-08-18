import { Router } from 'express';

import {
    createAdmin
} from '../controllers/adminController.js';

import {
    authenticate
} from '../middleware/authMiddleware.js';

import {
    authorizeRoles
} from '../middleware/roleMiddleware.js';

const router = Router();

router.post(
    '/',
    authenticate,
    authorizeRoles('admin'),
    createAdmin
);

export default router;