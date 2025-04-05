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
//       this.user = null;
//       this.token = null;
//       this.isAuthenticated = false;
//       localStorage.removeItem('token');
//     }
//   }
// });




// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
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
        this.user = response.data.user;
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
      // Arrêter le gestionnaire de timeout s'il existe
      if (window.sessionTimeoutManager) {
        window.sessionTimeoutManager.stop();
        window.sessionTimeoutManager = null;
      }
      
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
});