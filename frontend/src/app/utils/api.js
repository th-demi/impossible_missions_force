import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://impossible-missions-force-ec6d.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request if it exists
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    console.log('Token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

export const gadgets = {
  getAll: (status) => {
    const query = status ? `?status=${status}` : '';
    return api.get(`/gadgets${query}`);
  },
  getById: (id) => api.get(`/gadgets/${id}`),
  create: (gadgetData) => api.post('/gadgets', gadgetData),
  update: (id, gadgetData) => api.patch(`/gadgets/${id}`, gadgetData),
  decommission: (id) => api.delete(`/gadgets/${id}`),
  selfDestruct: (id, confirmationCode) => 
    api.post(`/gadgets/${id}/self-destruct`, { confirmationCode }),
};

export default api;