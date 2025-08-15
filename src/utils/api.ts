import axios from 'axios';

function normalizeBase(url?: string) {
  const base = (url || 'http://localhost:4000').replace(/\/+$/, ''); 
  return base;
}

const BASE = normalizeBase(process.env.NEXT_PUBLIC_API_BASE);

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Single request interceptor
api.interceptors.request.use((config) => {
  // Add authorization header if token exists
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Handle URL construction properly
  let path = (config.url || '').trim();
  
  // If it's already a full URL, don't modify it
  if (/^https?:\/\//i.test(path)) {
    return config;
  }

  // Remove leading slashes and ensure proper API path
  path = path.replace(/^\/+/, '');
  
  // If it doesn't start with 'api/', add it
  if (!path.toLowerCase().startsWith('api/')) {
    path = `api/${path}`;
  }

  config.url = path;
  return config;
});

export default api;

