import { Router } from 'express';
import { seoController } from '../controllers/seoController';

const router = Router();

router.get('/robots.txt', seoController.getRobots);
router.get('/sitemap.xml', seoController.getSitemap);
router.get('/news-sitemap.xml', seoController.getNewsSitemap);
router.get('/rss.xml', seoController.getRss);
router.get('/meta', seoController.getMeta);

export default router;
