import { Router } from 'express';
import { sentimentController } from '../controllers/sentimentController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.post('/sentiment', sentimentController.analyzeText);
router.get('/analysis/:messageId', sentimentController.getAnalysisForMessage);
router.get('/insights', requireRole(['admin', 'agent']), sentimentController.getCustomerInsights);

export default router;
