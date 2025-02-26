import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/', // Remplace par l'URL de ton backend
  timeout: 10000, // Timeout pour les requêtes
});

export default instance;
