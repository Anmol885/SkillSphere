import { Router } from 'express';
import * as notificationsController from '../controllers/notifications.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', notificationsController.getNotifications);
router.patch('/:id/read', notificationsController.markNotificationAsRead);

export default router;
