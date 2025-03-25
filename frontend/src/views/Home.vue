<template>
  <div id="home" class="home-container">
    
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
          <img src="@/assets/image_diapo2.jpg" class="d-block w-100" alt="Fils à coudre colorés en gros plan">
          <div class="carousel-caption d-none d-md-block">
            <h1 class="display-4 carousel-title">Nos Produits</h1>
            <p class="lead carousel-text">Des produits de qualité pour tous vos besoins.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="@/assets/image_diapo3.jpg" class="d-block w-100" alt="Fils à coudre colorés en gros plan">
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

    
    <div class="section">
      <h2 class="section-title">Fibres Synthétiques</h2>
      <p class="section-description">Découvrez les matières synthétiques, pratiques et résistantes.</p>
      <div class="category-grid">
        <div 
          v-for="category in syntheticCategories" 
          :key="category.id" 
          class="category-card" 
          @click="goToDetail(category.id)"
          tabindex="0"
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
          tabindex="0"
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
          tabindex="0"
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


 

    <!-- Section Admin (seulement visible pour les administrateurs) -->
    <div v-if="isAdmin" class="section admin-section">
      <h2 class="section-title">Panneau d'Administration</h2>
      <div class="admin-actions">
        <router-link to="/admin/textiles" class="admin-link">Gérer les Textiles</router-link>
        <router-link to="/admin/users" class="admin-link">Gérer les Utilisateurs</router-link>
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
const selectedTextile = ref(null);

// Catégories de fibres
const syntheticCategories = [
  {
    id: 1, 
    name: 'Polyester',
    image: '/src/assets/polyester.jpg'
  },
  {
    id: 2,
    name: 'Nylon',
    image: '/src/assets/nylon.jpg'
  }
];

const animalCategories = [
  {
    id: 3,
    name: 'Laine',
    image: '/src/assets/laine.jpg'
  },
  {
    id: 4,
    name: 'Soie',
    image: '/src/assets/La_soie.jpg'
  }
];

const technicalCategories = [
  {
    id: 5,
    name: 'Kevlar',
    image: '/src/assets/kevlar.jpg'
  },
  {
    id: 6,
    name: 'Gore-Tex',
    image: '/src/assets/gore-tex.jpg'
  }
];

const isAdmin = computed(() => {
  return authStore.isUserAuthenticated && authStore.userRole === 'admin';
});

const loadTextileDetails = async (textileId) => {
  try {
    const response = await api.get(`/textiles/${textileId}`);
    selectedTextile.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des détails du textile:', error);
    selectedTextile.value = null;
  }
};

const goToDetail = (categoryId) => {
  // Mapping des IDs numériques vers les slugs pour l'URL
  const categoryMap = {
    1: 'polyester',
    2: 'nylon',
    3: 'laine',
    4: 'soie',
    5: 'kevlar',
    6: 'gore_tex'
  };
  
  router.push(`/details/${categoryMap[categoryId]}`);
};


// Fonction handleFavorite mise à jour pour assurer des valeurs valides

const handleFavorite = async (event, textileId) => {
  event.stopPropagation();

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

    const isFavorite = isInFavorites(textileId);

    if (isFavorite) {
      // Supprimer des favoris
      await api.delete(`/users/favorites/${textileId}`, config);
      favorites.value = favorites.value.filter(id => id !== textileId);
      
      // Notification de suppression
      Swal.fire({
        icon: 'success',
        title: 'Retiré des favoris',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        background: '#30343F',
        color: '#FFD9DA'
      });
    } else {
      // Ajouter aux favoris avec détails
      const { value: favoriteData } = await Swal.fire({
        title: 'Ajouter aux favoris',
        html: `
          <div class="favorite-form">
            <div class="form-group">
              <label for="frequency">Fréquence d'utilisation</label>
              <select id="frequency" class="swal2-input">
                <option value="Fréquemment">Fréquemment</option>
                <option value="Régulièrement">Régulièrement</option>
                <option value="Occasionnellement" selected>Occasionnellement</option>
                <option value="Rarement">Rarement</option>
              </select>
            </div>
            <div class="form-group">
              <label for="usage">Contexte d'utilisation</label>
              <input id="usage" class="swal2-input" placeholder="Ex: Vêtements, Ameublement..." aria-label="Contexte d'utilisation">
            </div>
            <div class="form-group">
              <label for="notes">Notes personnelles</label>
              <textarea id="notes" class="swal2-textarea" placeholder="Vos notes sur ce textile..." aria-label="Notes personnelles"></textarea>
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Ajouter',
        cancelButtonText: 'Annuler',
        background: '#30343F',
        color: '#FFD9DA',
        preConfirm: () => {
          const frequencyVal = document.getElementById('frequency').value;
          const usageVal = document.getElementById('usage').value;
          const notesVal = document.getElementById('notes').value;
          
          // Validation côté client - s'assurer que la fréquence est une valeur autorisée
          const validFrequencies = ['Fréquemment', 'Régulièrement', 'Occasionnellement', 'Rarement'];
          
          if (!validFrequencies.includes(frequencyVal)) {
            Swal.showValidationMessage('Veuillez sélectionner une fréquence d\'utilisation valide');
            return false;
          }
          
          return {
            frequency_of_use: frequencyVal,
            usage_context: usageVal || null,
            personal_notes: notesVal || null
          };
        }
      });

      // Vérifier si l'utilisateur a cliqué sur Ajouter et non sur Annuler
      if (favoriteData) {
        console.log('Données du favori à envoyer:', favoriteData);
        
        // Vérifier une dernière fois que la fréquence est valide
        const validFrequencies = ['Fréquemment', 'Régulièrement', 'Occasionnellement', 'Rarement'];
        if (!validFrequencies.includes(favoriteData.frequency_of_use)) {
          favoriteData.frequency_of_use = 'Occasionnellement';
        }
        
        try {
          // Envoyer la requête d'ajout de favori
          const response = await api.post(`/users/favorites/${textileId}`, favoriteData, config);
          
          if (response.data && response.data.success) {
            favorites.value.push(textileId);
            
            // Notification d'ajout
            Swal.fire({
              icon: 'success',
              title: 'Ajouté aux favoris',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 1500,
              background: '#30343F',
              color: '#FFD9DA'
            });
          } else {
            throw new Error('Erreur lors de l\'ajout du favori');
          }
        } catch (apiError) {
          console.error('Erreur API lors de l\'ajout du favori:', apiError);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'ajout aux favoris',
            background: '#30343F',
            color: '#FFD9DA'
          });
        }
      }
    }
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
    console.log('Réponse brute des favoris:', response.data);
    
    if (response.data && Array.isArray(response.data.favorites)) {
      favorites.value = response.data.favorites.map(fav => fav.id);
    } else if (Array.isArray(response.data)) {
      favorites.value = response.data.map(fav => fav.id);
    } else {
      favorites.value = [];
    }
    
    console.log('Favoris chargés:', favorites.value);
  } catch (error) {
    console.error('Erreur détaillée lors du chargement des favoris:', error);
    favorites.value = [];
  }
};

const isInFavorites = (textileId) => {
  return favorites.value.includes(textileId);
};

const getFavoriteAriaLabel = (textileId) => {
  return isInFavorites(textileId) 
    ? `Retirer ${textileId} des favoris` 
    : `Ajouter ${textileId} aux favoris`;
};

onMounted(async () => {
  console.log('Home component mounted, auth state:', authStore.isUserAuthenticated);
  await loadFavorites();
});
</script>

<style scoped>
/* Style de base */
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
}

/* Carrousel */
.carousel {
  margin-bottom: 3rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.carousel-item img {
  height: 400px;
  object-fit: cover;
}

.carousel-caption {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  padding: 1rem;
}

.carousel-title {
  font-weight: bold;
  color: #FFD9DA;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-text {
  color: #FEFCFB;
}

/* Sections */
.section {
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: #30343F;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #FEFCFB;
}

.section-title {
  color: #FFD9DA;
  margin-bottom: 1rem;
  font-size: 2rem;
  text-align: center;
}

.section-description {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

/* Grille de catégories */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.category-card {
  background-color: #1B2021;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.category-card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.category-card-body {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-card-title {
  margin: 0;
  color: #FFD9DA;
  font-size: 1.2rem;
}

.favorite-btn {
  background: none;
  border: none;
  color: #EA638C;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;
}

.favorite-btn:hover {
  color: #89023E;
  transform: scale(1.2);
}

.favorite-btn i.fa-heart {
  color: #89023E;
}

/* Styles pour le formulaire dans SweetAlert */
:global(.favorite-form) {
  text-align: left;
  margin-top: 1rem;
}

:global(.favorite-form .form-group) {
  margin-bottom: 1rem;
}

:global(.favorite-form label) {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }
  
  .carousel-item img {
    height: 300px;
  }
  
  .section {
    padding: 1.5rem;
  }
  
  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 576px) {
  .carousel-item img {
    height: 200px;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .category-card:hover {
    transform: none;
  }
  
  .favorite-btn:hover {
    transform: none;
  }
}

.textile-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
}

.textile-details {
  margin-bottom: 1rem;
}

.textile-characteristics {
  background-color: #1B2021;
  padding: 1rem;
  border-radius: 5px;
}

.textile-characteristics h4 {
  color: #FFD9DA;
  margin-bottom: 0.5rem;
}

.textile-characteristics ul {
  margin: 0;
  padding-left: 1.5rem;
}

.textile-popup {
  max-width: 600px;
}
</style>