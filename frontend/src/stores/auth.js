

// // src/stores/auth.js
// import { defineStore } from 'pinia'
// import axios from 'axios'

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     user: null,
//     token: localStorage.getItem('token') || null,
//     isAuthenticated: !!localStorage.getItem('token')
//   }),
    
//   getters: {
//     getUser: (state) => state.user,
//     getToken: (state) => state.token,
//     isUserAuthenticated: (state) => state.isAuthenticated,
//     userRole: (state) => state.user?.role,
//     isAdmin: (state) => state.user?.role === 'admin'
//   },
  
//   actions: {
//     async login(email, password) {
//       try {
//         const response = await axios.post('/api/users/login', {
//           email,
//           password
//         });
        
//         if (response.data.token) {
//           this.$patch({
//             user: response.data.user,
//             token: response.data.token,
//             isAuthenticated: true
//           });
//           localStorage.setItem('token', response.data.token);
//           return { success: true };
//         }
//         return { success: false, error: 'Token non reçu' };
//       } catch (error) {
//         console.error('Erreur de connexion:', error.response?.data || error.message);
//         return {
//           success: false,
//           error: error.response?.data?.message || 'Erreur lors de la connexion'
//         };
//       }
//     },
    
//     async fetchUserProfile() {
//       try {
//         const response = await axios.get('/api/users/profile');
//         this.user = response.data.user;
//         return { success: true };
//       } catch (error) {
//         console.error('Erreur lors de la récupération du profil:', error);
//         return {
//           success: false,
//           error: error.response?.data?.message || 'Erreur lors de la récupération du profil'
//         };
//       }
//     },
    
//     logout() {
//       // Arrêter le gestionnaire de timeout s'il existe
//       if (window.sessionTimeoutManager) {
//         window.sessionTimeoutManager.stop();
//         window.sessionTimeoutManager = null;
//       }
      
//       this.user = null;
//       this.token = null;
//       this.isAuthenticated = false;
//       localStorage.removeItem('token');
//     }
//   }
// });




// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '../axios'  // Importez l'instance api au lieu d'axios

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null, // Ajout du refresh token
    isAuthenticated: !!localStorage.getItem('token')
  }),
  
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isUserAuthenticated: (state) => state.isAuthenticated,
    userRole: (state) => state.user?.role,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  
  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/users/login', {  // Utilisez api au lieu d'axios
          email,
          password
        });
        
        if (response.data.token) {
          this.$patch({
            user: response.data.user,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            isAuthenticated: true
          });
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
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
    
    // Méthode de refresh token mise à jour
    async refreshAccessToken() {
      try {
        if (!this.refreshToken) {
          throw new Error('Pas de refresh token disponible');
        }
        
        const response = await api.post('/users/refresh-token', {  // Utilisez api au lieu d'axios
          refreshToken: this.refreshToken
        });
        
        if (response.data.success) {
          // Mettre à jour le token d'accès
          this.token = response.data.token;
          localStorage.setItem('token', response.data.token);
          return response.data.token;
        }
        
        // Si le refresh échoue, déconnecter l'utilisateur
        this.logout();
        return null;
      } catch (error) {
        console.error('Erreur de refresh token:', error);
        this.logout();
        return null;
      }
    },
    
    async fetchUserProfile() {
      try {
        const response = await api.get('/users/profile');  // Utilisez api au lieu d'axios
        this.user = response.data.user;
        return { success: true };
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        
        // Si on a une erreur 401, on tente de rafraîchir le token
        if (error.response?.status === 401) {
          const newToken = await this.refreshAccessToken();
          if (newToken) {
            // Réessayer après refresh du token
            try {
              const retryResponse = await api.get('/users/profile');
              this.user = retryResponse.data.user;
              return { success: true };
            } catch (retryError) {
              return {
                success: false,
                error: retryError.response?.data?.message || 'Erreur après refresh token'
              };
            }
          }
        }
        
        return {
          success: false,
          error: error.response?.data?.message || 'Erreur lors de la récupération du profil'
        };
      }
    },
    
    logout() {
      // Arrêter le gestionnaire de timeout s'il existe
      if (window.sessionTimeoutManager) {
        window.sessionTimeoutManager.stop();
        window.sessionTimeoutManager = null;
      }
      
      this.user = null;
      this.token = null;
      this.refreshToken = null; // Réinitialiser le refresh token
      this.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken'); // Supprimer le refresh token du localStorage
    }
  }
});


