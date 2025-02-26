<template>
    <div class="test-container">
      <h1>Test d'authentification</h1>
      
      <div class="card">
        <h2>État de l'authentification</h2>
        <p>Authentifié: {{ isAuthenticated ? 'Oui' : 'Non' }}</p>
        <p>Token présent: {{ hasToken ? 'Oui' : 'Non' }}</p>
        
        <div v-if="tokenInfo">
          <h3>Informations du token</h3>
          <pre>{{ tokenInfo }}</pre>
        </div>
      </div>
      
      <div class="card">
        <h2>Test API</h2>
        <button @click="testAPI" class="button">Tester l'API</button>
        
        <div v-if="apiResponse" class="response">
          <h3>Réponse de l'API</h3>
          <pre>{{ apiResponse }}</pre>
        </div>
        
        <div v-if="apiError" class="error">
          <h3>Erreur API</h3>
          <pre>{{ apiError }}</pre>
        </div>
      </div>
      
      <div class="card">
        <h2>Actions</h2>
        <button @click="goToDashboard" class="button">Aller au Dashboard</button>
        <button @click="logout" class="button danger">Déconnexion</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import axios from 'axios';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const tokenInfo = ref(null);
  const apiResponse = ref(null);
  const apiError = ref(null);
  const hasToken = ref(false);
  
  // Calculer si l'utilisateur est authentifié
  const isAuthenticated = computed(() => authStore.isUserAuthenticated);
  
  // Analyser le token JWT pour le débogage
  const decodeToken = () => {
    const token = localStorage.getItem('token');
    hasToken.value = !!token;
    
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          tokenInfo.value = JSON.stringify(payload, null, 2);
        } else {
          tokenInfo.value = "Format de token invalide";
        }
      } catch (e) {
        tokenInfo.value = `Erreur décodage: ${e.message}`;
      }
    }
  };
  
  // Tester une requête API directe
  const testAPI = async () => {
    try {
      apiResponse.value = null;
      apiError.value = null;
      
      const token = localStorage.getItem('token');
      
      // Test directement avec axios (sans instance préconfigurée)
      const response = await axios.get('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      apiResponse.value = JSON.stringify(response.data, null, 2);
    } catch (error) {
      console.error("Erreur test API:", error);
      
      apiError.value = JSON.stringify({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      }, null, 2);
    }
  };
  
  // Navigation et déconnexion
  const goToDashboard = () => {
    router.push('/dashboard');
  };
  
  const logout = () => {
    authStore.logout();
    router.push('/login');
  };
  
  // Initialisation
  onMounted(() => {
    decodeToken();
  });
  </script>
  
  <style scoped>
  .test-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .card {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    margin-right: 10px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .danger {
    background-color: #f44336;
  }
  
  pre {
    background-color: #333;
    color: #fff;
    padding: 10px;
    border-radius: 4px;
    overflow: auto;
  }
  
  .error {
    color: #f44336;
  }
  
  .response {
    color: #4CAF50;
  }
  </style>