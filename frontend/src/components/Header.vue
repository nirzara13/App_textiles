

<template>
  <header class="main-header">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img src="@/assets/app-textile_Logo.png" alt="Logo" class="navbar-logo" />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link nav-btn">Accueil</router-link>
            </li>
            <!-- Menu pour utilisateur non connecté -->
            <template v-if="!authStore.isAuthenticated">
              <li class="nav-item">
                <router-link to="/login" class="nav-link nav-btn">Se connecter</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/signup" class="nav-link nav-btn">S'inscrire</router-link>
              </li>
            </template>
            <!-- Menu pour utilisateur connecté -->
            <template v-else>
              <li class="nav-item">
                <router-link to="/dashboard" class="nav-link nav-btn">Mon Dashboard</router-link>
              </li>
              <li class="nav-item">
                <button @click="handleLogout" class="nav-link nav-btn logout-btn">
                  Se déconnecter
                </button>
              </li>
            </template>
            <li class="nav-item">
              <router-link to="/contact" class="nav-link nav-btn">Contact</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    authStore.logout();
    await Swal.fire({
      icon: 'success',
      title: 'Déconnexion réussie',
      text: 'À bientôt !',
      timer: 1500,
      showConfirmButton: false
    });
    router.push('/login');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};

import { watch } from 'vue';

// Ajouter un watcher sur le localStorage
watch(
  () => localStorage.getItem('token'),
  (newValue) => {
    authStore.$patch({
      isAuthenticated: !!newValue,
      token: newValue
    });
  },
  { immediate: true }
);
</script>

<style scoped>
/* Importation de la police Shrikhand depuis Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');

/* Style du header */
.main-header {
  background-color: #30343f;
  padding: 30px 0;
  font-family: 'Shrikhand', cursive;
}

.navbar-brand img {
  height: 50px;
  width: auto;
}

.navbar {
  padding: 0 50px;
}

.nav-item {
  margin-left: 20px;
}

.nav-link {
  font-size: 1.2rem;
  color: #ffd9da;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  padding: 8px 16px;
  font-family: 'Shrikhand', cursive;
}

.nav-link:hover {
  background-color: #89023e;
  border-radius: 5px;
  color: #fff;
  transform: scale(1.1);
}

.nav-btn {
  position: relative;
  display: inline-block;
  overflow: hidden;
  color: #ffd9da;
  padding: 12px 30px;
  font-size: 1.1rem;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 2px;
  border-radius: 25px;
  transition: all 0.4s ease;
  text-decoration: none;
  font-family: 'Shrikhand', cursive;
}

.nav-btn:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background-color: #ea638c;
  transition: all 0.4s ease;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
}

.nav-btn:hover {
  color: #fff;
  transform: translateY(-3px);
}

.nav-btn:hover:before {
  transform: translate(-50%, -50%) scale(1);
}

.navbar-logo {
  width: 100px !important;
  height: auto !important;
}

.logout-btn {
  background: none;
  border: none;
  width: 100%;
  text-align: center;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #89023e;
  border-radius: 5px;
  color: #fff;
  transform: scale(1.1);
}
</style>