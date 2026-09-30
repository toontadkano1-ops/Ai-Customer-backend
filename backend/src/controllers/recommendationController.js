import { recommendationService } from '../services/recommendation/recommendationService.js';
import { db } from '../database/db.js';

export const recommendationController = {
  getForCustomer: async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const businessId = req.user.business_id;

      // Check customer isolation
      if (req.user.role === 'customer' && req.user.id !== customerId) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const recommendations = await recommendationService.getRecommendationsForCustomer(customerId, businessId);

      res.json({
        success: true,
        data: recommendations
      });
    } catch (err) {
      next(err);
    }
  },

  listProducts: async (req, res, next) => {
    try {
      const businessId = req.user.business_id;
      const products = await db.find('products', { business_id: businessId, active: true });
      res.json({ success: true, data: products });
    } catch (err) {
      next(err);
    }
  }
};
