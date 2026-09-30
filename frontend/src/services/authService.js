import api from './api.js';

export const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  register: async (data) => {
    return api.post('/auth/register', data);
  },

  getMe: async () => {
    return api.get('/auth/me');
  }
};
