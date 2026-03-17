import axios from 'axios';
const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001';
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('toefl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 → redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('toefl_token');
      localStorage.removeItem('toefl_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;
