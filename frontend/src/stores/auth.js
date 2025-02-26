// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token') // Modification ici pour être réactif
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isUserAuthenticated: (state) => state.isAuthenticated
  },

  actions: {
    async register(email, password) {
      try {
        const response = await axios.post('/api/users/signup', {
          email,
          password
        });

        this.user = response.data.user;
        this.token = response.data.token;
        this.isAuthenticated = true; // Important pour la réactivité
        localStorage.setItem('token', response.data.token);

        return { success: true };
      } catch (error) {
        console.error('Erreur d\'inscription:', error.response?.data || error.message);
        return {
          success: false,
          error: error.response?.data?.message || 'Erreur lors de l\'inscription'
        };
      }
    },

    // Dans auth.js, modifiez l'action login :
async login(email, password) {
  try {
    const response = await axios.post('/api/users/login', {
      email,
      password
    });

    if (response.data.token) {
      this.$patch({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true
      });
      localStorage.setItem('token', response.data.token);
      return { success: true };
    }
    return { success: false, error: 'Token non reçu' };
  } catch (error) {
    console.error('Erreur de connexion:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la connexion'
    };
  }
},

    async fetchUserProfile() {
      try {
        const response = await axios.get('/api/users/profile');
        this.user = response.data;
        return { success: true };
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        return {
          success: false,
          error: error.response?.data?.message || 'Erreur lors de la récupération du profil'
        };
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false; // Important pour la réactivité
      localStorage.removeItem('token');
    }
  }
});