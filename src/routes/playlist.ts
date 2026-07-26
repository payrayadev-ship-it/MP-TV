import { Router } from 'express';
import { playlistController } from '../controllers/playlistController';

const router = Router();

router.get('/', playlistController.getAll);
router.post('/', playlistController.create);
router.put('/', playlistController.update);
router.delete('/', playlistController.delete);

export default router;
