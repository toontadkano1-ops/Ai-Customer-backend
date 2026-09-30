import { Router } from 'express';
import { customerController } from '../controllers/customerController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', requireRole(['admin', 'agent']), customerController.list);
router.get('/:id', customerController.getById);
router.post('/', requireRole(['admin', 'agent']), customerController.create);
router.put('/:id', customerController.update);

export default router;
