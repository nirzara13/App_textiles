// frontend/src/axios.js
import axios from 'axios';

// Configuration d'axios avec une URL de base
const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // Ajusté pour correspondre à votre backend
});

// Ajout des intercepteurs
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;