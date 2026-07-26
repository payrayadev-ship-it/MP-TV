import { Router } from 'express';
import { runningTextController } from '../controllers/runningTextController';

const router = Router();

router.get('/', runningTextController.getAll);
router.post('/', runningTextController.create);

export default router;
