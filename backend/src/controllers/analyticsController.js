import { analyticsService } from '../services/analytics/analyticsService.js';

export const analyticsController = {
  getOverview: async (req, res, next) => {
    try {
      const businessId = req.user.business_id;
      const { range } = req.query;
      const data = await analyticsService.getOverviewMetrics(businessId, range || '30d');
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getSentiment: async (req, res, next) => {
    try {
      const businessId = req.user.business_id;
      const data = await analyticsService.getSentimentMetrics(businessId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getEngagement: async (req, res, next) => {
    try {
      const businessId = req.user.business_id;
      const data = await analyticsService.getEngagementTrends(businessId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  getSupport: async (req, res, next) => {
    try {
      const businessId = req.user.business_id;
      const data = await analyticsService.getSupportMetrics(businessId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
};
