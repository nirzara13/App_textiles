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
              :src="textile.image_url || '/src/assets/default-textile.jpg'" 
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
                      :src="tissu.image_url || '/src/assets/default-fabric.jpg'" 
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
  
  // Catégories (pour faire correspondre les slugs aux IDs)
  const categoryMap = {
    'polyester': 1,
    'nylon': 2,
    'laine': 3,
    'soie': 4,
    'kevlar': 5,
    'gore_tex': 6
  };
  
  // Conversion du slug en ID
  const getTextileIdFromSlug = (slug) => {
    return categoryMap[slug];
  };
  
  // Récupérer le nom d'un textile par son ID
  const getTextileName = (id) => {
    const textile = textiles.value.find(t => t.id === id);
    return textile ? textile.name : `Textile #${id}`;
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
      
      // Récupérer les informations du textile
      const textileResponse = await api.get(`/textiles/${textileId}`);
      textile.value = textileResponse.data;
      
      // Récupérer tous les textiles pour les références de composition
      try {
        const allTextilesResponse = await api.get('/textiles');
        textiles.value = allTextilesResponse.data;
      } catch (error) {
        console.warn('Impossible de récupérer tous les textiles:', error);
        textiles.value = [];
      }
      
      // Récupérer les tissus associés
      try {
        const tissusResponse = await api.get(`/tissus/textile/${textileId}`);
        tissus.value = tissusResponse.data.tissus || [];
        
        // Si nous avons des tissus, récupérer leurs compositions
        if (tissus.value.length > 0) {
          const compositionPromises = tissus.value.map(tissu => 
            api.get(`/compositions/tissu/${tissu.id}`)
              .then(response => {
                // Ajouter les compositions au tissu correspondant
                tissu.compositions = response.data.compositions || [];
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
  
  // Vérifier si le textile est dans les favoris
  const checkIfInFavorites = async (textileId) => {
    try {
      const response = await api.get('/users/favorites');
      
      if (response.data && Array.isArray(response.data.favorites)) {
        isInFavorites.value = response.data.favorites.some(fav => fav.id === textileId);
      } else if (Array.isArray(response.data)) {
        isInFavorites.value = response.data.some(fav => fav.id === textileId);
      } else {
        isInFavorites.value = false;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error);
      isInFavorites.value = false;
    }
  };
  
  // Gérer l'ajout/retrait des favoris
  const handleFavorite = async () => {
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
      const textileId = getTextileIdFromSlug(route.params.slug);
      
      if (isInFavorites.value) {
        // Retirer des favoris
        await api.delete(`/users/favorites/${textileId}`);
        isInFavorites.value = false;
        
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
        // Ajouter aux favoris
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
                <input id="usage" class="swal2-input" placeholder="Ex: Vêtements, Ameublement...">
              </div>
              <div class="form-group">
                <label for="notes">Notes personnelles</label>
                <textarea id="notes" class="swal2-textarea" placeholder="Vos notes sur ce textile..."></textarea>
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
            return {
              frequency_of_use: document.getElementById('frequency').value || 'Occasionnellement',
              usage_context: document.getElementById('usage').value || null,
              personal_notes: document.getElementById('notes').value || null
            }
          }
        });
  
        if (favoriteData) {
          // Afficher les données pour le débogage
          console.log('Données envoyées au serveur:', favoriteData);
          
          // Envoyer les données au serveur
          await api.post(`/users/favorites/${textileId}`, favoriteData);
          isInFavorites.value = true;
          
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