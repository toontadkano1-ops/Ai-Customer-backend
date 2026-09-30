import api from './api.js';

export const customerService = {
  list: async () => {
    return api.get('/customers');
  },

  getById: async (id) => {
    return api.get(`/customers/${id}`);
  },

  create: async (data) => {
    return api.post('/customers', data);
  },

  update: async (id, data) => {
    return api.put(`/customers/${id}`, data);
  }
};
