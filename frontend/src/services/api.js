import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cx_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized redirects
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('cx_token');
        localStorage.removeItem('cx_user');
      }
    }
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
