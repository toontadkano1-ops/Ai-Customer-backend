import { Router } from 'express';
import { knowledgeController } from '../controllers/knowledgeController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', knowledgeController.list);
router.get('/:id', knowledgeController.getById);
router.post('/', requireRole(['admin', 'agent']), knowledgeController.create);
router.put('/:id', requireRole(['admin', 'agent']), knowledgeController.update);
router.delete('/:id', requireRole('admin'), knowledgeController.delete);

export default router;
