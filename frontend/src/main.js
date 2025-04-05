// // src/main.js
// import { createApp } from 'vue';
// import { createPinia } from 'pinia';
// import App from './App.vue';
// import router from './router';
// import axios from 'axios';
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap";
// import 'font-awesome/css/font-awesome.min.css';
// import 'sweetalert2/dist/sweetalert2.min.css'

// // Configuration d'axios
// axios.defaults.baseURL = 'http://localhost:3000';
// axios.defaults.headers.common['Content-Type'] = 'application/json';

// // Intercepteur pour gérer les tokens d'authentification
// axios.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }
//   return config;
// });

// // Création de l'application
// const app = createApp(App);

// // Utilisation des plugins
// const pinia = createPinia();
// app.use(pinia);
// app.use(router);



// // Montage de l'application
// app.mount('#app');







// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import 'font-awesome/css/font-awesome.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import SessionTimeoutManager from './utils/sessionTimeout'; // Importer le gestionnaire
import { useAuthStore } from './stores/auth'; // Importer le store auth

// Configuration d'axios
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Intercepteur pour gérer les tokens d'authentification
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Création de l'application
const app = createApp(App);

// Utilisation des plugins
const pinia = createPinia();
app.use(pinia);
app.use(router);

// Initialiser le gestionnaire de timeout pour les utilisateurs authentifiés
router.beforeEach((to, from, next) => {
  // Vérifier si un token existe
  const isAuthenticated = !!localStorage.getItem('token');
  
  if (isAuthenticated && !window.sessionTimeoutManager) {
    // Récupérer le store auth après l'initialisation de Pinia
    const authStore = useAuthStore();
    
    // Créer et initialiser le gestionnaire de timeout
    window.sessionTimeoutManager = new SessionTimeoutManager({
      timeout: 2 * 60 * 1000, // 5 minutes pour faciliter le test
      countdown: 60 * 1000, // Alerte 1 minute avant
      keepAliveUrl: 'http://localhost:3000/api/users/keepalive',
      authStore: authStore,
      onTimeout: function() {
        authStore.logout();
        router.push('/login?expired=true');
      }
    }).init();
  } else if (!isAuthenticated && window.sessionTimeoutManager) {
    // Arrêter le gestionnaire si l'utilisateur se déconnecte
    window.sessionTimeoutManager.stop();
    window.sessionTimeoutManager = null;
  }
  
  next();
});

// Montage de l'application
app.mount('#app');