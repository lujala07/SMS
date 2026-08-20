import { Router } from 'express';

import {
    getNotices,
    addNotice,
    editNotice,
    removeNotice,
    getAudienceNotices
} from '../controllers/noticeController.js';

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
    getNotices
);

router.get(
    '/audience/:audience',
    authenticate,
    getAudienceNotices
);

router.post(
    '/',
    authenticate,
    authorizeRoles(
        'admin',
        'teacher'
    ),
    addNotice
);

router.put(
    '/:id',
    authenticate,
    authorizeRoles(
        'admin',
        'teacher'
    ),
    editNotice
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles(
        'admin',
        'teacher'
    ),
    removeNotice
);

export default router;