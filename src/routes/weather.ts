import { Router } from 'express';
import { weatherController } from '../controllers/weatherController';

const router = Router();

router.get('/', weatherController.getWeather);

export default router;
