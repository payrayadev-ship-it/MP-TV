import { Router } from 'express';
import { newsDigestController } from '../controllers/newsDigestController';

const router = Router();

router.get('/', newsDigestController.getAll);
router.post('/generate', newsDigestController.generateScript);
router.post('/digest', newsDigestController.generateExecutiveDigest);

export default router;
