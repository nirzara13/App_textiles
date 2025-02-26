<template>
  <div id="home" class="home-container">
    <!-- Carrousel -->
    <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="@/assets/colorful-sewing-threads-background-closeup.jpg" class="d-block w-100" alt="Fils à coudre colorés en gros plan">
          <div class="carousel-caption d-none d-md-block">
            <h1 class="display-4 carousel-title">Bienvenue sur notre site !</h1>
            <p class="lead carousel-text">Explorez nos produits et services innovants.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="@/assets/colorful-sewing-threads-background-closeup.jpg" class="d-block w-100" alt="Fils à coudre colorés en gros plan">
          <div class="carousel-caption d-none d-md-block">
            <h1 class="display-4 carousel-title">Nos Produits</h1>
            <p class="lead carousel-text">Des produits de qualité pour tous vos besoins.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="@/assets/colorful-sewing-threads-background-closeup.jpg" class="d-block w-100" alt="Fils à coudre colorés en gros plan">
          <div class="carousel-caption d-none d-md-block">
            <h1 class="display-4 carousel-title">Contactez-nous</h1>
            <p class="lead carousel-text">Nous sommes là pour vous aider.</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Système de Débogage (à enlever en production) -->
    <div v-if="isDebugMode" class="debug-panel">
      <h5>Informations de débogage</h5>
      <p>Authentifié: {{ authStore.isUserAuthenticated }}</p>
      <p>Token présent: {{ !!localStorage.getItem('token') }}</p>
      <p>Favoris chargés: {{ favorites.length }}</p>
      <p>Favoris IDs: {{ favorites.join(', ') }}</p>
      <div class="debug-buttons">
        <button @click="loadFavorites" class="btn btn-sm btn-info">Recharger Favoris</button>
        <button @click="isDebugMode = false" class="btn btn-sm btn-secondary">Cacher Débogage</button>
      </div>
    </div>
    <div v-else class="text-center mt-2 mb-2">
      <button @click="isDebugMode = true" class="btn btn-sm btn-light">Afficher Débogage</button>
    </div>

    <!-- Section Fibres Synthétiques -->
    <div class="section">
      <h2 class="section-title">Fibres Synthétiques</h2>
      <p class="section-description">Découvrez les matières synthétiques, pratiques et résistantes.</p>
      <div class="category-grid">
        <div 
          v-for="category in syntheticCategories" 
          :key="category.id" 
          class="category-card" 
          @click="goToDetail(category.id)"
        >
          <img 
            :src="category.image" 
            class="category-card-img" 
            :alt="category.name"
          >
          <div class="category-card-body">
            <h3 class="category-card-title">{{ category.name }}</h3>
            <button 
              @click.stop="handleFavorite($event, category.id)" 
              class="favorite-btn"
              :aria-label="getFavoriteAriaLabel(category.id)"
            >
              <i 
                :class="['fa', isInFavorites(category.id) ? 'fa-heart' : 'fa-heart-o']"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Fibres Naturelles Animales -->
    <div class="section">
      <h2 class="section-title">Fibres Naturelles Animales</h2>
      <p class="section-description">Explorez les fibres naturelles provenant d'animaux.</p>
      <div class="category-grid">
        <div 
          v-for="category in animalCategories" 
          :key="category.id" 
          class="category-card" 
          @click="goToDetail(category.id)"
        >
          <img 
            :src="category.image" 
            class="category-card-img" 
            :alt="category.name"
          >
          <div class="category-card-body">
            <h3 class="category-card-title">{{ category.name }}</h3>
            <button 
              @click.stop="handleFavorite($event, category.id)" 
              class="favorite-btn"
              :aria-label="getFavoriteAriaLabel(category.id)"
            >
              <i 
                :class="['fa', isInFavorites(category.id) ? 'fa-heart' : 'fa-heart-o']"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Fibres Techniques/Innovantes -->
    <div class="section">
      <h2 class="section-title">Fibres Techniques/Innovantes</h2>
      <p class="section-description">Découvrez les fibres techniques et innovantes utilisées dans l'industrie textile.</p>
      <div class="category-grid">
        <div 
          v-for="category in technicalCategories" 
          :key="category.id" 
          class="category-card" 
          @click="goToDetail(category.id)"
        >
          <img 
            :src="category.image" 
            class="category-card-img" 
            :alt="category.name"
          >
          <div class="category-card-body">
            <h3 class="category-card-title">{{ category.name }}</h3>
            <button 
              @click.stop="handleFavorite($event, category.id)" 
              class="favorite-btn"
              :aria-label="getFavoriteAriaLabel(category.id)"
            >
              <i 
                :class="['fa', isInFavorites(category.id) ? 'fa-heart' : 'fa-heart-o']"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/axios';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();
const favorites = ref([]);
const isDebugMode = ref(false);

// Catégories de fibres (restent identiques)
const syntheticCategories = [
  {
    id: 1, // ID numérique au lieu de 'polyester'
    name: 'Polyester',
    image: '/src/assets/colorful-sewing-threads-background-closeup.jpg'
  },
  {
    id: 2, // ID numérique au lieu de 'nylon'
    name: 'Nylon',
    image: '/src/assets/colorful-sewing-threads-background-closeup.jpg'
  }
];

const animalCategories = [
  {
    id: 3, // ID numérique au lieu de 'laine'
    name: 'Laine',
    image: '/src/assets/colorful-sewing-threads-background-closeup.jpg'
  },
  {
    id: 4, // ID numérique au lieu de 'soie'
    name: 'Soie',
    image: '/src/assets/colorful-sewing-threads-background-closeup.jpg'
  }
];

const technicalCategories = [
  {
    id: 5, // ID numérique au lieu de 'kevlar'
    name: 'Kevlar',
    image: '/src/assets/colorful-sewing-threads-background-closeup.jpg'
  },
  {
    id: 6, // ID numérique au lieu de 'gore_tex'
    name: 'Gore-Tex',
    image: '/src/assets/colorful-sewing-threads-background-closeup.jpg'
  }
];
const goToDetail = (category) => {
  // Si vous utilisez des IDs numériques dans votre base de données
  const textileMap = {
    1: 'polyester',
    2: 'nylon',
    3: 'laine',
    4: 'soie',
    5: 'kevlar',
    6: 'gore_tex'
  };
  
  router.push(`/details/${textileMap[category]}`);
};

const handleFavorite = async (event, textileId) => {
  // Empêcher la propagation de l'événement
  event.stopPropagation();

  // Vérifier l'authentification
  if (!authStore.isUserAuthenticated) {
    const result = await Swal.fire({
      title: 'Connexion requise',
      text: 'Vous devez être connecté pour ajouter des favoris',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: "S'inscrire",
      cancelButtonText: 'Se connecter',
      confirmButtonColor: '#89023E',
      cancelButtonColor: '#EA638C',
      background: '#30343F',
      color: '#FFD9DA'
    });

    if (result.isConfirmed) {
      router.push('/signup');
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      router.push('/login');
    }
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { 'Authorization': `Bearer ${token}` }
    };

    // Vérifier si déjà favori
    const isFavorite = isInFavorites(textileId);

    if (isFavorite) {
      // Retirer des favoris
      await api.delete(`/users/favorites/${textileId}`, config);
      favorites.value = favorites.value.filter(id => id !== textileId);
    } else {
      // Ajouter aux favoris
      await api.post(`/users/favorites/${textileId}`, {}, config);
      favorites.value.push(textileId);
    }

    Swal.fire({
      icon: 'success',
      title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      background: '#30343F',
      color: '#FFD9DA'
    });
  } catch (error) {
    console.error('Erreur lors de la gestion des favoris:', error);
    
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.response?.data?.message || 'Impossible de gérer les favoris',
      confirmButtonText: 'OK',
      background: '#30343F',
      color: '#FFD9DA'
    });
  }
};


// Dans Home.vue, assurez-vous que loadFavorites est définie avant onMounted
const loadFavorites = async () => {
  try {
    if (!authStore.isUserAuthenticated) {
      favorites.value = [];
      return;
    }
    
    const token = localStorage.getItem('token');
    const config = {
      headers: { 'Authorization': `Bearer ${token}` }
    };
    
    const response = await api.get('/users/favorites', config);
    console.log('Réponse favoris:', response.data);
    
    if (response.data && Array.isArray(response.data.favorites)) {
      favorites.value = response.data.favorites.map(fav => fav.id);
    } else if (Array.isArray(response.data)) {
      favorites.value = response.data.map(fav => fav.id);
    } else {
      favorites.value = [];
    }
  } catch (error) {
    console.error('Erreur lors du chargement des favoris:', error);
    favorites.value = []; // Initialiser à vide en cas d'erreur
  }
};

// Ensuite seulement, utilisez onMounted
onMounted(async () => {
  console.log('Home component mounted, auth state:', authStore.isUserAuthenticated);
  await loadFavorites();
});

const isInFavorites = (textileId) => {
  return favorites.value.includes(textileId);
};

const getFavoriteAriaLabel = (textileId) => {
  return isInFavorites(textileId) 
    ? `Retirer ${textileId} des favoris` 
    : `Ajouter ${textileId} aux favoris`;
};

// Chargement des favoris au montage du composant
onMounted(async () => {
  console.log('Home component mounted, auth state:', authStore.isUserAuthenticated);
  await loadFavorites();
});
</script>

<style scoped>
/* Grille de cartes */
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 cartes par ligne pour un meilleur affichage */
  gap: 30px;
  padding: 20px;
  justify-content: center; /* Centrer les cartes horizontalement */
}

/* Section */
.section {
  margin: 40px 0;
  text-align: center; /* Centre les titres de section */
}

/* Titre de section */
.section-title {
  font-family: 'Shrikhand', sans-serif;
  font-size: 2rem;
  color: #1B2021;
  margin-bottom: 10px;
}

/* Description de section */
.section-description {
  font-size: 1.2rem;
  color: #30343F;
  margin-bottom: 20px;
}

/* Carte */
.category-card {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  position: relative;
}

.category-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Image de la carte */
.category-card-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

/* Corps de la carte */
.category-card-body {
  padding: 15px;
}

/* Titre de la carte */
.category-card-title {
  font-family: 'Shrikhand', sans-serif;
  font-size: 1.5rem;
  color: #1B2021;
  margin: 10px 0;
}

/* Bouton Favori */
.favorite-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #89023E;
  cursor: pointer;
  padding: 10px;
}

.favorite-btn:hover {
  color: #ea638c;
}

/* Applique la police Shrikhand sur le texte du carrousel */
.carousel-title, .carousel-text {
  font-family: 'Shrikhand', sans-serif;
}

/* Style du carrousel (si tu veux personnaliser davantage) */
.carousel-caption {
  color: #ffffff; /* Assure que le texte reste bien visible */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* Améliore la lisibilité sur fond clair ou sombre */
}

.carousel-title {
  font-size: 3rem;
  color: #FFD9DA;
}

.carousel-text {
  font-size: 1.25rem;
  color: #FEFCFB;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 20px;
  justify-content: center;
}

.section {
  margin: 40px 0;
  text-align: center;
}

.section-title {
  font-family: 'Shrikhand', sans-serif;
  font-size: 2rem;
  color: #1B2021;
  margin-bottom: 10px;
}

.section-description {
  font-size: 1.2rem;
  color: #30343F;
  margin-bottom: 20px;
}

.category-card {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-align: center;
  position: relative;
}

.category-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.category-card-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.category-card-body {
  padding: 15px;
}

.category-card-title {
  font-family: 'Shrikhand', sans-serif;
  font-size: 1.5rem;
  color: #1B2021;
  margin: 10px 0;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #89023E;
  cursor: pointer;
  padding: 10px;
}

.favorite-btn:hover {
  color: #ea638c;
}

.carousel-title, .carousel-text {
  font-family: 'Shrikhand', sans-serif;
}

.carousel-caption {
  color: #ffffff;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

.carousel-title {
  font-size: 3rem;
  color: #FFD9DA;
}

.carousel-text {
  font-size: 1.25rem;
  color: #FEFCFB;
}

/* Ajout des styles pour le débogage */
.debug-panel {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  font-size: 0.8rem;
}

.debug-buttons {
  margin-top: 10px;
  display: flex;
  gap: 5px;
}
</style>
