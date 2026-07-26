import { Router } from 'express';
import { schedulesController } from '../controllers/schedulesController';

const router = Router();

router.get('/', schedulesController.getAll);
router.post('/', schedulesController.create);

export default router;
