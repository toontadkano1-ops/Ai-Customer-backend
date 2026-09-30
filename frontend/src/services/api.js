import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl !== '/api' && !envUrl.startsWith('/')) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  // Automatically fallback to live Render backend if running on cloud domain
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://ai-customer-backend-4qfq.onrender.com/api';
  }
  return '/api';
};

const resolvedBaseURL = getBaseURL();
console.log('[CX Intelligence API] Target URL:', resolvedBaseURL);

const api = axios.create({
  baseURL: resolvedBaseURL,
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
    let message = error.response?.data?.message;
    if (!message) {
      if (error.response?.status === 404) {
        message = 'Backend API endpoint not found (404). Please ensure backend is running and VITE_API_BASE_URL points to backend /api.';
      } else if (error.code === 'ERR_NETWORK') {
        message = 'Cannot connect to backend server. Please verify backend is running.';
      } else {
        message = error.message || 'An unexpected error occurred';
      }
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
