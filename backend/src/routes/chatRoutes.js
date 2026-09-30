import { Router } from 'express';
import { chatController } from '../controllers/chatController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.post('/message', chatController.sendMessage);
router.get('/conversations', chatController.getConversations);
router.get('/conversations/:id', chatController.getConversationById);
router.post('/conversations/:id/messages', chatController.addConversationMessage);
router.patch('/conversations/:id', chatController.updateConversationStatus);
router.post('/escalate', chatController.escalate);
router.post('/feedback', chatController.submitFeedback);

export default router;
