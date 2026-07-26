import { Router } from 'express';
import { articlesController } from '../controllers/articlesController';

const router = Router();

router.get('/', articlesController.getAll);
router.post('/', articlesController.create);

export default router;
