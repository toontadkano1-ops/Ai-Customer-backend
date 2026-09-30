import api from './api.js';

export const analyticsService = {
  getOverview: async (range = '30d') => {
    return api.get(`/analytics/overview?range=${range}`);
  },

  getSentiment: async () => {
    return api.get('/analytics/sentiment');
  },

  getEngagement: async () => {
    return api.get('/analytics/engagement');
  },

  getSupport: async () => {
    return api.get('/analytics/support');
  },

  getInsights: async () => {
    return api.get('/ai/insights');
  }
};
