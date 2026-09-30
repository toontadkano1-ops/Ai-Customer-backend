import api from './api.js';

export const knowledgeService = {
  list: async (search = '', category = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    return api.get(`/knowledge?${params.toString()}`);
  },

  getById: async (id) => {
    return api.get(`/knowledge/${id}`);
  },

  create: async (data) => {
    return api.post('/knowledge', data);
  },

  update: async (id, data) => {
    return api.put(`/knowledge/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/knowledge/${id}`);
  }
};
