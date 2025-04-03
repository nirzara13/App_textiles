<template>
  <div class="textile-detail-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement des détails...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <h2>Erreur lors du chargement des données</h2>
      <p>{{ error }}</p>
      <button @click="fetchTextileDetails" class="btn-primary">Réessayer</button>
    </div>

    <div v-else class="textile-content">
      <!-- Section pour la matière textile (en haut) -->
      <div class="textile-header">
        <h1 class="textile-title">{{ textile.name }}</h1>
        <button 
          @click="handleFavorite" 
          class="favorite-btn"
          :aria-label="isInFavorites ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        >
          <i :class="['fa', isInFavorites ? 'fa-heart' : 'fa-heart-o']"></i>
        </button>
      </div>

      <div class="textile-main">
        <!-- Image de la matière textile de base -->
        <div class="textile-image-container">
          <img 
            :src="getTextileImagePath(textile)" 
            :alt="textile.name"
            class="textile-image"
          >
          <div class="image-caption">
            <span>Matière première : {{ textile.name }}</span>
          </div>
        </div>

        <div class="textile-info">
          <div class="info-section">
            <h2>Description</h2>
            <p>{{ textile.description }}</p>
          </div>

          <div v-if="textile.category" class="info-section">
            <h2>Catégorie</h2>
            <p>{{ textile.category.name }}</p>
          </div>

          <div class="info-section">
            <h2>Types de tissus disponibles</h2>
            <div v-if="tissus && tissus.length > 0" class="tissus-list">
              <div v-for="tissu in tissus" :key="tissu.id" class="tissu-card">
                <div class="tissu-header">
                  <h3>{{ tissu.name }}</h3>
                </div>
                
                <!-- Image du tissu spécifique -->
                <div class="tissu-image-container">
                  <img 
                    :src="tissu.image_url" 
                    :alt="tissu.name"
                    class="tissu-image"
                  >
                </div>
                
                <div class="tissu-details">
                  <p><strong>Type de tissage:</strong> {{ tissu.weave_type }}</p>
                  <p v-if="tissu.description">{{ tissu.description }}</p>
                  
                  <div v-if="tissu.compositions && tissu.compositions.length > 0" class="composition-section">
                    <h4>Composition:</h4>
                    <ul class="composition-list">
                      <li v-for="comp in tissu.compositions" :key="comp.id" class="composition-item">
                        <span class="composition-name">{{ getTextileName(comp.textile_id) }}:</span>
                        <span class="composition-percentage">{{ comp.percentage }}%</span>
                      </li>
                    </ul>
                  </div>

                  <div v-if="tissu.care_instructions" class="care-section">
                    <h4>Entretien:</h4>
                    <p>{{ tissu.care_instructions }}</p>
                  </div>

                  <div v-if="tissu.recommended_use" class="usage-section">
                    <h4>Usages recommandés:</h4>
                    <p>{{ tissu.recommended_use }}</p>
                  </div>
                </div>
              </div>
            </div>
            <p v-else>Aucun tissu disponible pour cette matière</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// États
const textile = ref({});
const tissus = ref([]);
const compositions = ref([]);
const loading = ref(true);
const error = ref(null);
const isInFavorites = ref(false);
const textiles = ref([]); // Pour stocker tous les textiles pour les références de nom
const rawResponse = ref(null); // Pour stocker la réponse API brute pour débogage

// Fonction pour obtenir le chemin d'image d'un textile - avec plusieurs fallbacks
const getTextileImagePath = (textile) => {
  // Débogage
  console.log('Textile pour image :', textile);

  // 1. Essayez d'abord d'utiliser l'URL directe si elle existe
  if (textile.image_url) {
    console.log('Utilisation de image_url depuis textile:', textile.image_url);
    return textile.image_url;
  }

  // 2. Utilisez un chemin basé sur le nom du textile
  if (textile.name) {
    const normalizedName = textile.name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlève les accents
      .replace(/[^a-z0-9]/g, '-'); // Remplace les caractères spéciaux par des tirets
      
    const path = `/src/assets/${normalizedName}.jpg`;
    console.log('Utilisation du chemin basé sur le nom:', path);
    return path;
  }
  
  // 3. Utilisez un chemin basé sur l'ID
  if (textile.id) {
    const idMap = {
      1: '/src/assets/polyester.jpg',
      2: '/src/assets/nylon.jpg',
      3: '/src/assets/laine.jpg',
      4: '/src/assets/soie.jpg',
      5: '/src/assets/kevlar.jpg',
      6: '/src/assets/gore-tex.jpg'
    };
    
    if (idMap[textile.id]) {
      console.log('Utilisation du chemin basé sur l\'ID:', idMap[textile.id]);
      return idMap[textile.id];
    }
  }
  
  // 4. En dernier recours, retournez une image par défaut
  console.log('Utilisation de l\'image par défaut');
  return '/src/assets/default-textile.jpg';
};

// Mapping des slugs vers les IDs de textiles
const textileSlugMap = {
  'polyester': 1,
  'nylon': 2,
  'laine': 3,
  'soie': 4,
  'kevlar': 5,
  'gore-tex': 6,
  'gore_tex': 6 
};

// Conversion du slug en ID de textile
const getTextileIdFromSlug = (slug) => {
  // Si le slug est directement un des noms prédéfinis, utilisez le mapping
  if (textileSlugMap[slug]) {
    return textileSlugMap[slug];
  }
  
  // Sinon, essayez de convertir en nombre (si c'est un ID numérique)
  const id = parseInt(slug);
  if (!isNaN(id)) {
    return id;
  }
  
  // Si aucune correspondance n'est trouvée, retournez null
  console.error(`Slug non trouvé: ${slug}`);
  return null;
};

// Récupérer le nom d'un textile par son ID
const getTextileName = (id) => {
  const textile = textiles.value.find(t => t.id === id);
  return textile ? textile.name : `Textile #${id}`;
};

// Gestion des favoris
const checkIfInFavorites = async (textileId) => {
  try {
    const response = await api.get('/favorites/textiles');
    const favorites = response.data.favorites || [];
    isInFavorites.value = favorites.some(fav => fav.textile_id === textileId);
  } catch (error) {
    console.error('Erreur lors de la vérification des favoris:', error);
  }
};

const handleFavorite = async () => {
  if (!authStore.isUserAuthenticated) {
    Swal.fire({
      title: 'Connexion requise',
      text: 'Vous devez être connecté pour ajouter des favoris',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Se connecter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/login');
      }
    });
    return;
  }

  try {
    if (isInFavorites.value) {
      await api.delete(`/favorites/textiles/${textile.value.id}`);
      isInFavorites.value = false;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Retiré des favoris',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      await api.post('/favorites/textiles', { textile_id: textile.value.id });
      isInFavorites.value = true;
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Ajouté aux favoris',
        showConfirmButton: false,
        timer: 1500
      });
    }
  } catch (error) {
    console.error('Erreur lors de la gestion des favoris:', error);
    Swal.fire({
      title: 'Erreur',
      text: 'Une erreur est survenue lors de la gestion des favoris',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

// Récupérer les détails du textile
const fetchTextileDetails = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const slug = route.params.slug;
    const textileId = getTextileIdFromSlug(slug);
    
    if (!textileId) {
      error.value = 'Textile non trouvé';
      loading.value = false;
      return;
    }
    
    console.log('Récupération du textile avec ID:', textileId);
    
    // Récupérer les informations du textile
    const textileResponse = await api.get(`/textiles/${textileId}`);
    rawResponse.value = textileResponse.data;
    
    console.log('Structure complète de la réponse:', JSON.stringify(textileResponse.data, null, 2));
    
    // Extraire l'objet textile en fonction de la structure de la réponse
    if (textileResponse.data && textileResponse.data.success === true && textileResponse.data.data) {
      // Si la réponse est encapsulée dans {success, data}
      textile.value = textileResponse.data.data;
      console.log('Données extraites depuis response.data.data');
    } else {
      // Sinon, prendre directement la réponse
      textile.value = textileResponse.data;
      console.log('Données extraites directement depuis response.data');
    }
    
    console.log('Données du textile récupérées:', textile.value);
    console.log('Structure du textile:', Object.keys(textile.value));
    
    // Récupérer tous les textiles pour les références de composition
    try {
      const allTextilesResponse = await api.get('/textiles');
      
      // Vérifier la structure de la réponse
      if (allTextilesResponse.data && allTextilesResponse.data.success === true && allTextilesResponse.data.data) {
        textiles.value = allTextilesResponse.data.data;
      } else {
        textiles.value = allTextilesResponse.data;
      }
    } catch (error) {
      console.warn('Impossible de récupérer tous les textiles:', error);
      textiles.value = [];
    }
    
    // Récupérer les tissus associés
    try {
      const tissusResponse = await api.get(`/tissus/textile/${textileId}`);
      
      // Extraire les tissus en fonction de la structure de la réponse
      if (tissusResponse.data && tissusResponse.data.tissus) {
        tissus.value = tissusResponse.data.tissus;
      } else if (tissusResponse.data && tissusResponse.data.success === true && tissusResponse.data.data) {
        tissus.value = tissusResponse.data.data.tissus || [];
      } else if (Array.isArray(tissusResponse.data)) {
        tissus.value = tissusResponse.data;
      } else {
        tissus.value = [];
      }
      
      console.log('Tissus récupérés:', tissus.value);
      
      // Afficher les URLs des images pour déboguer
      if (tissus.value.length > 0) {
        tissus.value.forEach(tissu => {
          console.log(`Tissu ${tissu.id} - Image URL:`, tissu.image_url);
        });
      }
      
      // Si nous avons des tissus, récupérer leurs compositions
      if (tissus.value.length > 0) {
        const compositionPromises = tissus.value.map(tissu => 
          api.get(`/compositions/tissu/${tissu.id}`)
            .then(response => {
              // Ajouter les compositions au tissu correspondant
              if (response.data && response.data.compositions) {
                tissu.compositions = response.data.compositions;
              } else if (response.data && response.data.success === true && response.data.data) {
                tissu.compositions = response.data.data.compositions || [];
              } else {
                tissu.compositions = [];
              }
              return response.data;
            })
            .catch(error => {
              console.warn(`Impossible de récupérer les compositions pour le tissu ${tissu.id}:`, error);
              tissu.compositions = [];
              return { compositions: [] };
            })
        );
        
        await Promise.all(compositionPromises);
      }
    } catch (error) {
      console.warn('Tissus non disponibles:', error);
      tissus.value = [];
    }
    
    // Vérifier si le textile est dans les favoris (si l'utilisateur est connecté)
    if (authStore.isUserAuthenticated) {
      checkIfInFavorites(textileId);
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des détails du textile:', error);
    error.value = 'Une erreur est survenue lors du chargement des détails. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
};

// Initialisation
onMounted(() => {
  fetchTextileDetails();
});
</script>

<style scoped>
.textile-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  color: #FEFCFB;
}

/* Loading et erreurs */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(137, 2, 62, 0.3);
  border-top: 5px solid #89023E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  background-color: rgba(234, 99, 140, 0.1);
  border: 2px solid #EA638C;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin: 2rem 0;
}

/* Structure de base */
.textile-content {
  background-color: #30343F;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.textile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1B2021;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #89023E;
}

.textile-title {
  color: #FFD9DA;
  font-size: 2.2rem;
  margin: 0;
}

.favorite-btn {
  background: none;
  border: none;
  color: #EA638C;
  font-size: 1.8rem;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn:hover {
  color: #89023E;
  transform: scale(1.2);
}

.favorite-btn i.fa-heart {
  color: #89023E;
}

.textile-main {
  display: grid;
  grid-template-columns: 40% 60%;
  gap: 2rem;
  padding: 2rem;
}

.textile-image-container {
  overflow: hidden;
  border-radius: 8px;
  position: relative;
}

.textile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.textile-image:hover {
  transform: scale(1.05);
}

/* Image caption */
.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 0.5rem;
  color: #FFD9DA;
  background-color: rgba(27, 32, 33, 0.8);
  font-style: italic;
  font-size: 0.9rem;
}

/* Informations du textile */
.textile-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  background-color: #1B2021;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-section h2 {
  color: #FFD9DA;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(234, 99, 140, 0.3);
  padding-bottom: 0.5rem;
}

/* Tissus */
.tissus-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.tissu-card {
  background-color: rgba(234, 99, 140, 0.05);
  border-radius: 8px;
  padding: 1.2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tissu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.tissu-header {
  border-bottom: 1px solid rgba(234, 99, 140, 0.3);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
}

.tissu-card h3 {
  color: #FFD9DA;
  margin-top: 0;
  margin-bottom: 0;
  font-size: 1.3rem;
}

.tissu-card h4 {
  color: #EA638C;
  margin: 1rem 0 0.5rem;
  font-size: 1.1rem;
}

/* Images des tissus */
.tissu-image-container {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.tissu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tissu-image:hover {
  transform: scale(1.05);
}

.tissu-details {
  padding: 0.5rem;
}

.composition-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.composition-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  border-bottom: 1px dashed rgba(254, 252, 251, 0.1);
}

.composition-percentage {
  font-weight: bold;
}

.care-section, .usage-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(254, 252, 251, 0.1);
}

/* Responsive */
@media (max-width: 992px) {
  .textile-main {
    grid-template-columns: 1fr;
  }
  
  .textile-image-container {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .textile-detail-container {
    padding: 1rem;
  }
  
  .textile-header {
    padding: 1rem;
  }
  
  .textile-title {
    font-size: 1.8rem;
  }
  
  .tissus-list {
    grid-template-columns: 1fr;
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }
  
  .textile-image:hover {
    transform: none;
  }
  
  .tissu-image:hover {
    transform: none;
  }
  
  .tissu-card:hover {
    transform: none;
  }
  
  .favorite-btn:hover {
    transform: none;
  }
}
</style>