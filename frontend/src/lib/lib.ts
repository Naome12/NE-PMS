// lib/lib.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/', // Match your backend
  withCredentials: true, // Use this only if you're relying on cookies (optional)
});

// 🔐 Attach token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
