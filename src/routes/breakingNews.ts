import { Router } from 'express';
import { breakingNewsController } from '../controllers/breakingNewsController';

const router = Router();

router.get('/', breakingNewsController.getAll);
router.post('/', breakingNewsController.create);

export default router;
