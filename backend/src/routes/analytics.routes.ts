import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', analyticsController.getAnalytics);
router.get('/dashboard', analyticsController.getDashboardStats);

export default router;
