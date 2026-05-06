import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
});

// Inject token into every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.params = { ...config.params, token };
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authService = {
  login: (email, password) =>
    API.post('/login', { email, password }),

  register: (name, age, gender, email, password) =>
    API.post('/register', { name, age, gender, email, password }),
};

export const bpService = {
  getRecords: () => API.get('/records'),
  downloadCSV: () =>
    API.get('/download', { responseType: 'blob' }),
};

export default API;
