// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import 'font-awesome/css/font-awesome.min.css';
import 'sweetalert2/dist/sweetalert2.min.css'

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

// Montage de l'application
app.mount('#app');