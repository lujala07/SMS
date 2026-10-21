import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { getNotifications, markNotificationsRead } from '../services/notificationService.js';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res) => {
    const before = req.query.before === undefined ? undefined : Number(req.query.before);
    if (before !== undefined && (!Number.isInteger(before) || before <= 0 || before > 2147483647)) {
        return res.status(400).json({ message: 'Invalid notification cursor' });
    }
    try {
        return res.json(await getNotifications(req.user!.userId, before));
    } catch {
        return res.status(500).json({ message: 'Could not load notifications' });
    }
});

router.patch('/read', async (req, res) => {
    const { id, all = false } = req.body ?? {};
    if (!Number.isInteger(id) || id <= 0 || id > 2147483647 || typeof all !== 'boolean') {
        return res.status(400).json({ message: 'Invalid notification' });
    }
    try {
        await markNotificationsRead(req.user!.userId, id, all);
        return res.json({ message: 'Notifications marked as read' });
    } catch {
        return res.status(500).json({ message: 'Could not update notifications' });
    }
});

export default router;
