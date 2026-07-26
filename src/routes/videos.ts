import { Router } from 'express';
import { videosController } from '../controllers/videosController';

const router = Router();

router.get('/', videosController.getAll);
router.post('/', videosController.create);

export default router;
