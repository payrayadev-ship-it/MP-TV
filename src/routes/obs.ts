import { Router } from 'express';
import { obsController } from '../controllers/obsController';

const router = Router();

router.post('/connect', obsController.connect);
router.get('/status', obsController.getStatus);
router.post('/start-stream', obsController.startStream);
router.post('/stop-stream', obsController.stopStream);
router.post('/change-scene', obsController.changeScene);
router.post('/emergency-stop', obsController.emergencyStop);

export default router;
