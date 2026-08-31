import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('ngrok')) {
    return '/api';
  }
  if (typeof window !== 'undefined' && window.location.port === '3000') {
    return 'http://localhost:5000/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Send httpOnly cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor to attach Bearer token if stored in localStorage
api.interceptors.request.use((config) => {
  // If Authorization header is not explicitly passed by caller
  if (!config.headers.Authorization) {
    const adminToken = localStorage.getItem('codex_admin_token');
    const userToken = localStorage.getItem('codex_user_token');

    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
  }
  return config;
});

export default api;
