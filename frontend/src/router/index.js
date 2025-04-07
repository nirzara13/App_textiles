

// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Contact from '@/views/Contact.vue'
import Dashboard from '@/views/Dashboard.vue'
import TextileDetailView from '@/views/TextileDetailView.vue'

// Importez les nouvelles pages légales
import MentionsLegales from '@/views/MentionsLegales.vue'
import PolitiqueConfidentialite from '@/views/PolitiqueConfidentialite.vue'
import ConditionsUtilisation from '@/views/ConditionsUtilisation.vue'

import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/details/:slug',
    name: 'textileDetails',
    component: TextileDetailView
  },
  // Nouvelles routes pour les pages légales
  {
    path: '/mentions-legales',
    name: 'MentionsLegales',
    component: MentionsLegales
  },
  {
    path: '/politique-confidentialite',
    name: 'PolitiqueConfidentialite',
    component: PolitiqueConfidentialite
  },
  {
    path: '/conditions-utilisation',
    name: 'ConditionsUtilisation',
    component: ConditionsUtilisation
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll to top on route change
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Si la route requiert une authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Rediriger vers login avec l'URL actuelle comme redirect après connexion
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }
  
  // Si admin requis mais utilisateur non admin
  if (to.meta.requiresAdmin && authStore.userRole !== 'admin') {
    // Rediriger vers la page d'accueil
    next({ name: 'Home' });
    return;
  }
  
  // Pour toutes les autres routes, continuer normalement
  next();
});


export default router