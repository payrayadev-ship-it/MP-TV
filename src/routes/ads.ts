import { Router } from 'express';
import { adsController } from '../controllers/adsController';

const router = Router();

router.get('/', adsController.getAll);
router.post('/', adsController.create);

export default router;
