import { Router } from 'express';
import { recommendationController } from '../controllers/recommendationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/products', recommendationController.listProducts);
router.get('/:customerId', recommendationController.getForCustomer);

export default router;
