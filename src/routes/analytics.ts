import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';

const router = Router();

router.get('/', analyticsController.getAnalytics);

export default router;
