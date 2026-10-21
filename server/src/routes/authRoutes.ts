import { Router } from "express";
import { login, resendAccountInvitation, setPassword } from "../controllers/authController.js";
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/set-password', setPassword);
router.post('/resend-invitation', authenticate, authorizeRoles('admin'), resendAccountInvitation);

export default router;
