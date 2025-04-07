// // frontend/src/axios.js
// import axios from 'axios';

// // Configuration d'axios avec une URL de base
// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',  // Ajusté pour correspondre à votre backend
// });

// // Ajout des intercepteurs
// api.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;





//code du 07/04/2025

// frontend/src/axios.js
import axios from 'axios';
import { useAuthStore } from './stores/auth';

// Configuration d'axios avec une URL de base
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ajusté pour correspondre à votre backend
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

// Intercepteur de réponse avec gestion du refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Si erreur 401 (non autorisé) et pas déjà en cours de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // On utilise le store directement pour éviter les problèmes de circularité
        const authStore = useAuthStore();
        
        // Essayer de rafraîchir le token
        const newToken = await authStore.refreshAccessToken();
        
        if (newToken) {
          // Mettre à jour le header et réessayer la requête
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // Rediriger vers login si refresh échoue
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // En cas d'erreur lors du refresh, rediriger vers login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
