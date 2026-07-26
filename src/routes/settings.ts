import { Router } from 'express';
import { settingsController } from '../controllers/settingsController';

const router = Router();

router.get('/', settingsController.getSettings);
router.post('/', settingsController.update);

export default router;
