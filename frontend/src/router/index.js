
// // src/router/index.js
// import { createRouter, createWebHistory } from 'vue-router'
// import Home from '@/views/Home.vue'
// import Login from '@/views/Login.vue'
// import Signup from '@/views/Signup.vue'
// import Contact from '@/views/Contact.vue'
// import Dashboard from '@/views/Dashboard.vue'
//  // Dans votre router/index.js
 
//  import TextileDetailView from '@/views/TextileDetailView.vue'
 
// import { useAuthStore } from '@/stores/auth'; // Ajoutez aussi cet import


// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   },
//   {
//     path: '/login',
//     name: 'Login',
//     component: Login
//   },
//   {
//     path: '/signup',
//     name: 'Signup',
//     component: Signup
//   },
//   {
//     path: '/contact',
//     name: 'Contact',
//     component: Contact
//   },
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: Dashboard,
//     meta: { requiresAuth: true }
//   },

// {
//   path: '/',
//   name: 'Home',
//   component: Home
// },


//   {
//     path: '/details/:slug',
//     name: 'textileDetails',
//     component: () => import('../views/TextileDetailView.vue'),
//     // Pas besoin de meta.requiresAuth car accessible à tous
//   }
  

// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// // // Navigation guard pour protéger les routes authentifiées
// // router.beforeEach((to, from, next) => {
// //   const token = localStorage.getItem('token')
// //   if (to.meta.requiresAuth && !token) {
// //     next('/login')
// //   } else {
// //     next()
// //   }
// // })



// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
  
//   if (to.meta.requiresAdmin && authStore.userRole !== 'admin') {
//     next('/login');
//   } else {
//     next();
//   }
// });

// export default router














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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresAdmin && authStore.userRole !== 'admin') {
    next('/login');
  } else {
    next();
  }
});

export default router