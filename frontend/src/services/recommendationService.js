import api from './api.js';

export const recommendationService = {
  getForCustomer: async (customerId) => {
    return api.get(`/recommendations/${customerId}`);
  },

  getProducts: async () => {
    return api.get('/recommendations/products');
  }
};
