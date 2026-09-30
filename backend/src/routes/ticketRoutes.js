import { Router } from 'express';
import { ticketController } from '../controllers/ticketController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', ticketController.list);
router.post('/', ticketController.create);
router.get('/:id', ticketController.getById);
router.patch('/:id', ticketController.update);
router.post('/:id/messages', ticketController.addMessage);

export default router;
