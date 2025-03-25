// import { createRouter, createWebHistory } from 'vue-router';
// import Home from '../views/Home.vue';
// import Signup from '../views/Signup.vue';
// import Login from '../views/Login.vue';
// import Dashboard from '../views/Dashboard.vue';
// import Contact from '../views/Contact.vue';
// import MentionsLegales from '../views/MentionsLegales.vue'; // Import des pages légales
// import PolitiqueConfidentialite from '../views/PolitiqueConfidentialite.vue';
// import ConditionsUtilisation from '../views/PolitiqueConfidentialite.vue';

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: Home,
//   },
//   {
//     path: '/signup',
//     name: 'signup',
//     component: Signup,
//   },
//   {
//     path: '/login',
//     name: 'login',
//     component: Login,
//   },
//   {
//     path: '/dashboard',
//     name: 'dashboard',
//     component: Dashboard,
//     meta: { requiresAuth: true } // Ajoutez cette ligne
//   },
//   {
//     path: '/contact',
//     name: 'contact',
//     component: Contact,
//   },
//   {
//     path: '/mentions-legales',
//     name: 'mentions-legales',
//     component: MentionsLegales, // Route pour la page des mentions légales
//   },
//   {
//     path: '/politique-confidentialite',
//     name: 'politique-confidentialite',
//     component: PolitiqueConfidentialite, // Route pour la page de politique de confidentialité
//   },
//   {
//     path: '/conditions-utilisation',
//     name: 'conditions-utilisation',
//     component: ConditionsUtilisation, // Route pour la page des conditions d'utilisation
//   },
// ];

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes,
// });

// // Protection des routes
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!localStorage.getItem('userToken')) {
//       next('/login')
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })


// export default router;



// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Contact from '@/views/Contact.vue'
import Dashboard from '@/views/Dashboard.vue'
 // Dans votre router/index.js
 
 import TextileDetailView from '@/views/TextileDetailView.vue'
 
import { useAuthStore } from '@/stores/auth'; // Ajoutez aussi cet import


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
  path: '/',
  name: 'Home',
  component: Home
},


  {
    path: '/details/:slug',
    name: 'textileDetails',
    component: () => import('../views/TextileDetailView.vue'),
    // Pas besoin de meta.requiresAuth car accessible à tous
  }
  

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// // Navigation guard pour protéger les routes authentifiées
// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   if (to.meta.requiresAuth && !token) {
//     next('/login')
//   } else {
//     next()
//   }
// })



router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAdmin && authStore.userRole !== 'admin') {
    next('/login');
  } else {
    next();
  }
});

export default router