import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['admin', 'agent']));

router.get('/overview', analyticsController.getOverview);
router.get('/sentiment', analyticsController.getSentiment);
router.get('/engagement', analyticsController.getEngagement);
router.get('/support', analyticsController.getSupport);

export default router;
