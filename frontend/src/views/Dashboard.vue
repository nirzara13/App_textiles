<template>
  <div class="dashboard-container" role="main">
    <a href="#main-content" class="skip-link">
      Aller au contenu principal
    </a>

    <div id="main-content">
      <h1 class="dashboard-title" tabindex="0">Mon Tableau de Bord</h1>

      <!-- Section Profil -->
      <section 
        class="profile-section" 
        aria-labelledby="profile-details-title"
        role="region"
      >
        <h2 id="profile-details-title" tabindex="0">Mon Profil</h2>
        
        <!-- Mode affichage profil -->
        <div 
          v-if="!isEditingProfile" 
          class="profile-info"
          role="group"
          aria-label="Informations du profil"
        >
          <div class="info-item">
            <strong id="email-label">Email:</strong>
            <span aria-labelledby="email-label">
              {{ user && user.email ? user.email : 'Non disponible' }}
            </span>
          </div>

          <div class="button-group" role="group" aria-label="Actions du profil">
            <button 
              @click="toggleProfileEdit"
              @keyup.enter="toggleProfileEdit"
              class="btn-primary"
              aria-label="Modifier mon profil"
            >
              Modifier mon profil
            </button>
            <button 
              @click="confirmDelete"
              class="btn-danger"
              aria-label="Supprimer mon compte"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
        
        <!-- Mode édition profil -->
        <form 
          v-else 
          @submit.prevent="updateProfileDetails" 
          class="edit-form"
          aria-label="Formulaire de modification du profil"
        >
          <div class="form-group">
            <label for="email" id="email-input-label">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="editedProfile.email" 
              class="input-field"
              required
              :aria-invalid="!!emailError"
              aria-describedby="email-error"
            >
            <div 
              v-if="emailError" 
              id="email-error" 
              class="error-message" 
              role="alert"
            >
              {{ emailError }}
            </div>
          </div>
          
          <div class="form-group">
            <label for="currentPassword" id="current-password-label">
              Mot de passe actuel
            </label>
            <input 
              type="password"
              id="currentPassword" 
              v-model="currentPassword" 
              class="input-field"
              placeholder="Mot de passe actuel requis pour les modifications"
              required
            >
          </div>

          <div class="form-group">
            <label for="newPassword" id="password-label">
              Nouveau mot de passe (optionnel)
            </label>
            <div class="password-wrapper" role="group">
              <input 
                :type="showPassword ? 'text' : 'password'"
                id="newPassword" 
                v-model="editedProfile.newPassword" 
                class="input-field"
                aria-describedby="password-requirements"
                :minlength="8"
              >
              <button 
                type="button"
                class="toggle-password"
                @click="togglePassword"
                aria-label="Afficher/Masquer le mot de passe"
              >
                <span aria-hidden="true">
                  {{ showPassword ? '🙈' : '👁️' }}
                </span>
              </button>
            </div>
            <div id="password-requirements" class="help-text">
              Le mot de passe doit contenir au moins 8 caractères
            </div>
          </div>
          
          <div 
            class="button-group" 
            role="group" 
            aria-label="Actions de modification du profil"
          >
            <button 
              type="submit" 
              class="btn-success"
              :disabled="isSubmittingProfile"
              aria-busy="isSubmittingProfile"
            >
              {{ isSubmittingProfile ? 'Enregistrement...' : 'Sauvegarder' }}
            </button>
            <button 
              type="button" 
              @click="toggleProfileEdit" 
              class="btn-secondary"
              aria-label="Annuler les modifications"
            >
              Annuler
            </button>
          </div>
        </form>
      </section>

      <!-- Section Favoris -->
      <section 
        class="favorites-section" 
        aria-labelledby="favorites-title"
        role="region"
      >
        <h2 id="favorites-title" tabindex="0">Mes Favoris</h2>
        
        <div 
          v-if="favorites.length" 
          class="favorites-grid"
          role="list"
        >
          <div 
            v-for="textile in favorites" 
            :key="textile.id" 
            class="favorite-card"
            role="listitem"
          >
            <img 
              :src="textile.image_url || 'src/assets/colorful-sewing-threads-background-closeup.jpg'" 
              :alt="`Image de ${textile.name}`"
              class="textile-image"
            >
            <div class="textile-info">
              <h3 tabindex="0">{{ textile.name }}</h3>
              <p>{{ textile.description }}</p>
              <p>
                <strong>Catégorie:</strong> 
                <span>{{ textile.category && textile.category.name ? textile.category.name : 'Non disponible' }}</span>
              </p>
              
              <!-- Infos détaillées des favoris (nouvelles colonnes) -->
              <div class="favorite-details">
                <p data-testid="frequency-display"><strong>Fréquence d'utilisation:</strong> {{ textile.frequency_of_use }}</p>
                <p v-if="textile.usage_context"><strong>Contexte:</strong> {{ textile.usage_context }}</p>
                <p v-if="textile.personal_notes"><strong>Notes:</strong> {{ textile.personal_notes }}</p>
                
                <button 
                  @click="editFavoriteDetails(textile)"
                  class="btn-primary btn-sm"
                  aria-label="Modifier les détails"
                >
                  <i class="fa fa-pencil" aria-hidden="true"></i> Détails
                </button>
              </div>
              
              <button 
                @click="removeFavorite(textile.id)"
                class="btn-danger"
                :aria-label="`Retirer ${textile.name} des favoris`"
              >
                <i class="fa fa-trash" aria-hidden="true"></i> Retirer des favoris
              </button>
            </div>
          </div>
        </div>
        
        <p 
          v-else 
          class="no-favorites"
          role="status"
        >
          Vous n'avez pas encore de favoris. 
          <router-link 
            to="/" 
            class="link"
            aria-label="Aller à la page d'accueil pour découvrir les matières textiles"
          >
            Découvrir les matières textiles
          </router-link>
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/axios';
import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();

// Refs pour la gestion des états
const user = ref({});
const favorites = ref([]);
const showPassword = ref(false);
const emailError = ref('');
const currentPassword = ref('');

// Refs pour le profil
const editedProfile = ref({});
const isEditingProfile = ref(false);
const isSubmittingProfile = ref(false);

// Valider le formulaire avant soumission
const validateForm = () => {
  // Réinitialiser les erreurs
  emailError.value = '';

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(editedProfile.value.email)) {
    emailError.value = 'Veuillez entrer une adresse email valide';
    return false;
  }

  // Validation du mot de passe (s'il est modifié)
  if (editedProfile.value.newPassword && editedProfile.value.newPassword.length < 8) {
    Swal.fire({
      icon: 'error',
      title: 'Mot de passe invalide',
      text: 'Le mot de passe doit contenir au moins 8 caractères',
      background: '#30343F',
      color: '#FFD9DA'
    });
    return false;
  }

  return true;
};

// Gestion des erreurs API
const handleApiError = (error, defaultMessage) => {
  let errorMessage = defaultMessage;
  
  if (error.response) {
    // Le serveur a répondu avec un statut différent de 2xx
    errorMessage = error.response.data.message || defaultMessage;
  } else if (error.request) {
    // La requête a été faite mais pas de réponse
    errorMessage = 'Aucune réponse du serveur. Veuillez vérifier votre connexion.';
  } else {
    // Quelque chose s'est passé lors de la configuration de la requête
    errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
  }

  showErrorAlert(errorMessage);
};

// Charger les données de l'utilisateur
const loadUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { 'Authorization': `Bearer ${token}` }
    };
    
    const response = await api.get('/profile', config);
    console.log("Réponse profil:", response.data);
    
    // Gérer différentes structures de réponse possibles
    if (response.data && response.data.user) {
      user.value = response.data.user;
    } else if (response.data && response.data.success) {
      user.value = response.data;
    } else {
      user.value = response.data;
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error);
    handleApiError(error, 'Impossible de charger le profil');
  }
};

// Charger les favoris directement depuis l'API
const loadFavorites = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { 'Authorization': `Bearer ${token}` }
    };
    
    const response = await api.get('/users/favorites', config);
    console.log("Réponse favoris brute:", response.data);
    
    // Extraire les favoris selon la structure
    if (response.data && response.data.favorites) {
      favorites.value = response.data.favorites;
    } else if (Array.isArray(response.data)) {
      favorites.value = response.data;
    } else {
      favorites.value = [];
    }
    
    console.log("Favoris chargés:", favorites.value);
  } catch (error) {
    console.error('Erreur lors du chargement des favoris:', error);
    handleApiError(error, 'Impossible de charger les favoris');
    favorites.value = [];
  }
};

// Basculer l'édition du profil
const toggleProfileEdit = () => {
  isEditingProfile.value = !isEditingProfile.value;
  
  // Réinitialiser les valeurs lors de l'annulation
  if (!isEditingProfile.value) {
    editedProfile.value = { 
      email: user.value.email
    };
    currentPassword.value = '';
    emailError.value = '';
  }
};

// Mise à jour du profil
const updateProfileDetails = async () => {
  if (!validateForm()) return;

  try {
    isSubmittingProfile.value = true;
    
    const token = localStorage.getItem('token');
    const config = {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    // Données pour la mise à jour du profil principal
    const profileData = {
      email: editedProfile.value.email,
      password: currentPassword.value  // 
    };
    
    if (editedProfile.value.newPassword) {
      profileData.newPassword = editedProfile.value.newPassword;
    }
    
    console.log('Données envoyées pour mise à jour:', profileData);
    
    // Mettre à jour le profil principal
    const mainResponse = await api.put('/profile', profileData, config);
    console.log('Réponse mise à jour profil principal:', mainResponse.data);
    
    // Vérifier la mise à jour
    if (mainResponse.data.success || mainResponse.status === 200) {
      // Mettre à jour les données locales
      if (mainResponse.data.user) {
        user.value = mainResponse.data.user;
      } else if (mainResponse.data) {
        user.value = mainResponse.data;
      }
      
      // Sortir du mode édition
      isEditingProfile.value = false;
      currentPassword.value = '';
      
      // Notification de succès
      await Swal.fire({
        icon: 'success',
        title: 'Profil mis à jour!',
        text: 'Vos informations ont été modifiées avec succès',
        timer: 1500,
        showConfirmButton: false,
        background: '#30343F',
        color: '#FFD9DA'
      });
      
      // Si mot de passe modifié, déconnexion
      if (editedProfile.value.newPassword) {
        await Swal.fire({
          icon: 'info',
          title: 'Mot de passe mis à jour',
          text: 'Veuillez vous reconnecter avec votre nouveau mot de passe',
          confirmButtonText: 'OK',
          background: '#30343F',
          color: '#FFD9DA'
        });
        
        authStore.logout();
        router.push('/login');
      }
    } else {
      throw new Error('La mise à jour a échoué');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    let errorMessage = 'Impossible de mettre à jour le profil';
    
    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
      console.log('Réponse d\'erreur détaillée:', error.response.data);
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errorMessage,
      confirmButtonText: 'OK',
      background: '#30343F',
      color: '#FFD9DA'
    });
  } finally {
    isSubmittingProfile.value = false;
  }
};

// Retirer un favori
const removeFavorite = async (textileId) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { 'Authorization': `Bearer ${token}` }
    };
    
    await api.delete(`/users/favorites/${textileId}`, config);
    
    // Mettre à jour localement sans recharger tous les favoris
    favorites.value = favorites.value.filter(fav => fav.id !== textileId);
    
    Swal.fire({
      icon: 'success',
      title: 'Favori retiré',
      timer: 1500,
      showConfirmButton: false,
      background: '#30343F',
      color: '#FFD9DA'
    });
  } catch (error) {
    console.error('Erreur lors du retrait du favori:', error);
    handleApiError(error, 'Impossible de retirer ce favori');
  }
};

// Modification des détails d'un favori
const editFavoriteDetails = async (textile) => {
  // Mémoriser les valeurs actuelles
  const currentFrequency = textile.frequency_of_use || 'Occasionnellement';
  const currentUsage = textile.usage_context || '';
  const currentNotes = textile.personal_notes || '';
  
  const { value: favoriteData } = await Swal.fire({
    title: `Modifier les détails pour ${textile.name}`,
    html: `
      <div class="favorite-form">
        <div class="form-group">
          <label for="frequency">Fréquence d'utilisation</label>
          <select id="frequency" class="swal2-input">
            <option value="Fréquemment" ${currentFrequency === 'Fréquemment' ? 'selected' : ''}>Fréquemment</option>
            <option value="Régulièrement" ${currentFrequency === 'Régulièrement' ? 'selected' : ''}>Régulièrement</option>
            <option value="Occasionnellement" ${currentFrequency === 'Occasionnellement' ? 'selected' : ''}>Occasionnellement</option>
            <option value="Rarement" ${currentFrequency === 'Rarement' ? 'selected' : ''}>Rarement</option>
          </select>
        </div>
        <div class="form-group">
          <label for="usage">Contexte d'utilisation</label>
          <input id="usage" class="swal2-input" value="${currentUsage}" placeholder="Ex: Vêtements, Ameublement...">
        </div>
        <div class="form-group">
          <label for="notes">Notes personnelles</label>
          <textarea id="notes" class="swal2-textarea" placeholder="Vos notes sur ce textile...">${currentNotes}</textarea>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler',
    background: '#30343F',
    color: '#FFD9DA',
    preConfirm: () => {
      const frequencyVal = document.getElementById('frequency').value;
      const usageVal = document.getElementById('usage').value;
      const notesVal = document.getElementById('notes').value;
      
      return {
        frequency_of_use: frequencyVal || 'Occasionnellement',
        usage_context: usageVal || null,
        personal_notes: notesVal || null
      };
    }
  });

  if (favoriteData) {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'Authorization': `Bearer ${token}` }
      };
      
      console.log(`Mise à jour du favori ${textile.id} avec:`, favoriteData);
      
     
      const index = favorites.value.findIndex(fav => fav.id === textile.id);
      if (index !== -1) {
        favorites.value[index].frequency_of_use = favoriteData.frequency_of_use;
        favorites.value[index].usage_context = favoriteData.usage_context;
        favorites.value[index].personal_notes = favoriteData.personal_notes;
      }
      
      // Mettre à jour en base de données
      const response = await api.put(`/users/favorites/${textile.id}/details`, favoriteData, config);
      console.log('Réponse de mise à jour:', response.data);
      
      // Si la mise à jour côté serveur a réussi, on rafraîchit la liste pour être sûr
      if (response.data.success) {
        // Rechargement des favoris pour s'assurer d'avoir les données à jour
        await loadFavorites();
        
        Swal.fire({
          icon: 'success',
          title: 'Détails mis à jour',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          background: '#30343F',
          color: '#FFD9DA'
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Mise à jour partielle',
          text: 'Un problème est survenu lors de la mise à jour',
          background: '#30343F',
          color: '#FFD9DA'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des détails:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.message || 'Impossible de mettre à jour les détails',
        background: '#30343F',
        color: '#FFD9DA'
      });
    }
  }
};

// Confirmation de suppression de compte
const confirmDelete = async () => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr?',
    text: 'Cette action est irréversible. Voulez-vous vraiment supprimer votre compte?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    background: '#30343F',
    color: '#FFD9DA'
  });

  if (result.isConfirmed) {
    await deleteAccount();
  }
};

// Suppression du compte
const deleteAccount = async () => {
  try {
    // Demander le mot de passe de confirmation
    const { value: password } = await Swal.fire({
      title: 'Confirmation de suppression',
      text: 'Veuillez entrer votre mot de passe pour confirmer la suppression du compte',
      input: 'password',
      inputPlaceholder: 'Mot de passe',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      background: '#30343F',
      color: '#FFD9DA',
      preConfirm: (password) => {
        if (!password) {
          Swal.showValidationMessage('Veuillez entrer votre mot de passe');
        }
        return password;
      }
    });

    if (password) {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      // Envoyer la requête de suppression avec le mot de passe
      await api.delete('/profile', {
        ...config,
        data: { password }
      });
      
      // Déconnexion après suppression
      authStore.logout();
      
      await Swal.fire({
        icon: 'success',
        title: 'Compte supprimé',
        text: 'Votre compte a été supprimé avec succès',
        background: '#30343F',
        color: '#FFD9DA'
      });
      
      // Redirection vers la page de connexion
      router.push('/login');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    handleApiError(error, 'Impossible de supprimer votre compte');
  }
};

// Afficher/Masquer le mot de passe
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// Utilitaires pour l'accessibilité
const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.classList.add('sr-only');
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

// Afficher les alertes d'erreur
const showErrorAlert = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Erreur',
    text: message,
    background: '#30343F',
    color: '#FFD9DA'
  });
  announceToScreenReader(`Erreur : ${message}`);
};

// Surveillance des changements pour le débogage
watch(favorites, (newVal) => {
  console.log('Favoris mis à jour:', newVal);
}, { deep: true });

// Initialisation
onMounted(async () => {
  await loadUserData();
  await loadFavorites();
  
  // Initialiser le formulaire d'édition
  editedProfile.value = {
    email: user.value.email || '',
    newPassword: ''
  };
});
</script>

<style scoped>
@font-face {
  font-family: 'LifeLogo';
  src: url('@/assets/fonts/LifeLogo.ttf') format('truetype');
}

/* Style de base */
.dashboard-container {
  background-color: #1B2021;
  min-height: 100vh;
  padding: 2rem;
  color: #FEFCFB;
  font-family: 'Arial', sans-serif;
}

/* Skip link pour l'accessibilité */
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  background: #89023E;
  color: #FEFCFB;
  padding: 1rem;
  z-index: 9999;
  font-family: 'LifeLogo', sans-serif;
}

.skip-link:focus {
  left: 0;
  width: auto;
  height: auto;
  outline: 3px solid #EA638C;
}

/* Titres */
.dashboard-title {
  color: #FFD9DA;
  font-family: 'LifeLogo', sans-serif;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

h2 {
  color: #FFD9DA;
  font-family: 'LifeLogo', sans-serif;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

h3 {
  color: #FFD9DA;
  font-family: 'LifeLogo', sans-serif;
  margin-bottom: 0.5rem;
}

/* Sections */
.profile-section, .favorites-section {
  background-color: #30343F;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Informations utilisateur */
.info-item {
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(234, 99, 140, 0.3);
}

.profile-info {
  color: #FEFCFB;
  margin-bottom: 1.5rem;
}

/* Formulaires */
.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-family: 'LifeLogo', sans-serif;
  color: #FFD9DA;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #EA638C;
  border-radius: 4px;
  background-color: #30343F;
  color: #FEFCFB;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #89023E;
  box-shadow: 0 0 0 3px rgba(137, 2, 62, 0.5);
}

.input-field[aria-invalid="true"] {
  border-color: #EA638C;
  background-color: rgba(234, 99, 140, 0.1);
}

/* Gestion du mot de passe */
.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #FFD9DA;
  cursor: pointer;
  padding: 0.5rem;
  min-width: 44px;
  min-height: 44px;
  transition: color 0.3s;
}

.toggle-password:hover {
  color: #EA638C;
}

.toggle-password:focus {
  outline: none;
  color: #EA638C;
}

/* Messages */
.help-text {
  font-size: 0.9rem;
  color: #FFD9DA;
  margin-top: 0.5rem;
  font-style: italic;
}

.error-message {
  color: #EA638C;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  background-color: rgba(234, 99, 140, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: bold;
}

/* Boutons */
.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary, .btn-danger, .btn-success, .btn-secondary {
  font-family: 'LifeLogo', sans-serif;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  min-width: 44px;
  min-height: 44px;
  font-weight: bold;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: #89023E;
  color: #FEFCFB;
}

.btn-danger {
  background-color: #EA638C;
  color: #FEFCFB;
}

.btn-success {
  background-color: #89023E;
  color: #FEFCFB;
}

.btn-secondary {
  background-color: #30343F;
  border: 2px solid #EA638C;
  color: #FEFCFB;
}

/* États des boutons */
.btn-primary:hover, .btn-success:hover {
  background-color: #EA638C;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-danger:hover {
  background-color: #89023E;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background-color: #EA638C;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Favoris */
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.favorite-card {
  background-color: #30343F;
  border: 1px solid #EA638C;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.favorite-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.textile-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.textile-info {
  padding: 1rem;
}

.favorite-details {
  margin: 1rem 0;
  padding: 0.8rem;
  background-color: rgba(137, 2, 62, 0.1);
  border-radius: 4px;
  font-size: 0.9rem;
}

/* Message pas de favoris */
.no-favorites {
  text-align: center;
  font-family: 'LifeLogo', sans-serif;
  color: #FFD9DA;
  padding: 2rem;
  background-color: rgba(137, 2, 62, 0.1);
  border-radius: 8px;
}

.link {
  color: #EA638C;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.link:hover {
  text-decoration: underline;
  color: #89023E;
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
  
  .favorite-card:hover,
  .btn-primary:hover,
  .btn-danger:hover,
  .btn-success:hover,
  .btn-secondary:hover {
    box-shadow: none !important;
  }
}

:focus-visible {
  outline: 3px solid #89023E;
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-title {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  .button-group {
    flex-direction: column;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }
}

/* High Contrast Mode */
@media (forced-colors: active) {
  .input-field {
    border: 2px solid CanvasText;
  }
  
  .btn-primary,
  .btn-danger,
  .btn-success,
  .btn-secondary {
    border: 2px solid CanvasText;
  }
  
  .favorite-card {
    border: 2px solid CanvasText;
  }
}
</style>
  

  