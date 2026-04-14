import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://akoos-bakery-backend.onrender.com' 
    : 'http://localhost:3030');

// COMPLETELY SOLVE THE ISSUE: Ensure the URL always ends with /api
// This handles cases where people forget the /api in environment variables
if (rawBaseURL.endsWith('/')) {
  rawBaseURL = rawBaseURL.slice(0, -1);
}

const API_BASE_URL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Disable cookies - use only Authorization header
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach token from localStorage
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

// Response interceptor — handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on an auth page
      const authPaths = ['/login', '/register', '/forgot-password'];
      if (!authPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
