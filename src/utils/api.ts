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

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }


  let path = (config.url || '').trim();

 
  if (!/^https?:\/\//i.test(path)) {

    path = path.replace(/^\/+/, '');        
    path = path.replace(/^(api\/)+/i, 'api/'); 

    if (!path.toLowerCase().startsWith('api/')) {
      path = `api/${path}`;                  
    }

    config.url = `/${path}`;                  
  }

  return config;
});


api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token'); 
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;

