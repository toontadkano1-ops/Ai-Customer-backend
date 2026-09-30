import api from './api.js';

export const ticketService = {
  list: async () => {
    return api.get('/tickets');
  },

  getById: async (id) => {
    return api.get(`/tickets/${id}`);
  },

  create: async (data) => {
    return api.post('/tickets', data);
  },

  update: async (id, data) => {
    return api.patch(`/tickets/${id}`, data);
  },

  addMessage: async (id, { content, is_internal }) => {
    return api.post(`/tickets/${id}/messages`, { content, is_internal });
  }
};
