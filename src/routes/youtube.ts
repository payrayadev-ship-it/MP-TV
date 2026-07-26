import { Router } from 'express';
import { youtubeController } from '../controllers/youtubeController';

const router = Router();

router.get('/', youtubeController.getStatus);

export default router;
