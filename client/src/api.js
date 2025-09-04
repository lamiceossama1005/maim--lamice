import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';
const normalizedBase = rawBase.endsWith('/api') ? rawBase : `${rawBase.replace(/\/+$/, '')}/api`;
const API = axios.create({ baseURL: normalizedBase });

// Request interceptor: automatically attach token from localStorage
API.interceptors.request.use(cfg => {
  try {
    const token = localStorage.getItem('token');
    if (token) cfg.headers = cfg.headers || {}, cfg.headers['Authorization'] = `Bearer ${token}`;
  } catch (e) { }
  return cfg;
});

// Response interceptor: on 401 redirect to /login
API.interceptors.response.use(r => r, err => {
  if (err.response && err.response.status === 401) {
    try {
      // clear token and redirect to login
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') window.location.href = '/login';
    } catch (e) { }
  }
  return Promise.reject(err);
});

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export default API;
