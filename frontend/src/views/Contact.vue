<template>
  <div class="contact-container">
    <div class="contact-card">
      <h1>Contactez-nous</h1>
      <form @submit.prevent="handleSubmit" class="contact-form" novalidate>
        <div class="form-group">
          <label for="name" id="name-label">Nom</label>
          <input
            type="text"
            id="name"
            v-model="formData.name"
            aria-labelledby="name-label"
            aria-required="true"
            aria-invalid="formErrors.name !== ''"
          >
          <div v-if="formErrors.name" class="error-message" role="alert">{{ formErrors.name }}</div>
        </div>
        
        <div class="form-group">
          <label for="email" id="email-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            aria-labelledby="email-label"
            aria-required="true"
            aria-invalid="formErrors.email !== ''"
          >
          <div v-if="formErrors.email" class="error-message" role="alert">{{ formErrors.email }}</div>
        </div>
        
        <div class="form-group">
          <label for="message" id="message-label">Message</label>
          <textarea
            id="message"
            v-model="formData.message"
            aria-labelledby="message-label"
            aria-required="true"
            aria-invalid="formErrors.message !== ''"
            rows="5"
          ></textarea>
          <div v-if="formErrors.message" class="error-message" role="alert">{{ formErrors.message }}</div>
        </div>
        
        <!-- Captcha -->
        <div class="form-group captcha-container">
          <label for="captcha" id="captcha-label">Sécurité anti-robot</label>
          <div v-if="isLocked" class="captcha-locked" role="alert">
            <div class="lock-icon" aria-hidden="true">🔒</div>
            <p>Trop de tentatives incorrectes.</p>
            <p>Veuillez réessayer dans {{ Math.ceil((lockoutEndTime - new Date().getTime()) / 60000) }} minute(s).</p>
          </div>
          <div v-else class="captcha-wrapper">
            <div class="captcha-image" ref="captchaDisplay" aria-hidden="true">{{ captchaText }}</div>
            <button 
              type="button" 
              class="refresh-captcha" 
              @click="refreshCaptcha"
              aria-label="Générer un nouveau captcha"
            >
              <span class="refresh-icon" aria-hidden="true">&#x21bb;</span>
            </button>
          </div>
          <input
            type="text"
            id="captcha"
            v-model="captchaInput"
            placeholder="Entrez le code ci-dessus"
            aria-labelledby="captcha-label"
            aria-required="true"
            aria-invalid="formErrors.captcha !== ''"
            :disabled="isLocked"
          >
          <div v-if="formErrors.captcha" class="error-message" role="alert">{{ formErrors.captcha }}</div>
          <div class="captcha-info">
            <div class="captcha-audio" v-if="!isLocked">
              <button 
                type="button" 
                @click="readCaptcha" 
                class="audio-button"
                aria-label="Écouter le captcha"
              >
                Écouter le code
              </button>
            </div>
            <div class="captcha-attempts" v-if="captchaAttempts > 0 && !isLocked">
              <span class="attempts-info">{{ maxCaptchaAttempts - captchaAttempts }} tentative(s) restante(s)</span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <div class="form-actions">
            <button type="submit" aria-label="Envoyer le formulaire">Envoyer</button>
          </div>
          <div v-if="formSubmissionStatus" class="submission-status" role="status">
            {{ formSubmissionStatus }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue';

// État du formulaire
const formData = reactive({
  name: '',
  email: '',
  message: ''
});

// État des erreurs du formulaire
const formErrors = reactive({
  name: '',
  email: '',
  message: '',
  captcha: ''
});

// État de soumission du formulaire
const formSubmissionStatus = ref('');

// Captcha
const captchaText = ref('');
const captchaInput = ref('');
const captchaDisplay = ref(null);

// Sécurité renforcée: limitation des tentatives
const captchaAttempts = ref(0);
const maxCaptchaAttempts = 2; // Limité à 2 tentatives pour une sécurité accrue
const isLocked = ref(false);
const lockoutEndTime = ref(0);

// API URL
const apiBaseUrl = import.meta.env.VITE_API_URL || '';

// Générer un nouveau captcha avec complexité variable et mélange garanti
const generateCaptcha = async () => {
  // Ensembles de caractères distincts pour garantir la diversité
  const upperChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowerChars = 'abcdefghjkmnpqrstuvwxyz';
  const numbers = '23456789';
  const specialChars = '@#$%&';
  
  // Configuration de base
  let length = 6;
  
  // Augmentation de la complexité après des échecs
  if (captchaAttempts.value >= 1) {
    length = 7;
  }
  
  // Garantir au moins un caractère de chaque type
  let result = '';
  result += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
  result += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length)); // Garantit une minuscule
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  
  // Ajouter un caractère spécial après 1 tentative
  if (captchaAttempts.value >= 1) {
    result += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
  }
  
  // Compléter avec des caractères aléatoires
  const allChars = upperChars + lowerChars + numbers + (captchaAttempts.value >= 1 ? specialChars : '');
  while (result.length < length) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Mélanger les caractères pour éviter un pattern prévisible
  result = result.split('').sort(() => 0.5 - Math.random()).join('');
  
  captchaText.value = result;
  captchaInput.value = '';
  
  // Enregistre l'heure de génération du captcha pour la vérification du délai
  localStorage.setItem('captchaGeneratedTime', new Date().getTime().toString());
  
  // Envoyer le captcha au serveur pour synchronisation
  try {
    await fetch(`${apiBaseUrl}/set-captcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ captcha: result })
    });
  } catch (error) {
    console.error('Erreur lors de la synchronisation du captcha:', error);
  }
};

// Refresh captcha (côté client et serveur)
const refreshCaptcha = async () => {
  try {
    // Générer un nouveau captcha localement et l'envoyer au serveur
    await generateCaptcha();
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du captcha:', error);
  }
};

// Lecture audio du captcha pour l'accessibilité
const readCaptcha = () => {
  if ('speechSynthesis' in window) {
    const speech = new SpeechSynthesisUtterance();
    
    // Préparer le texte avec indication de la casse
    const characters = captchaText.value.split('');
    const spokenText = characters.map(char => {
      if (char >= 'A' && char <= 'Z') {
        return `majuscule ${char}`;
      } else if (char >= 'a' && char <= 'z') {
        return `minuscule ${char}`;
      } else if (char >= '0' && char <= '9') {
        return `chiffre ${char}`;
      } else {
        return `caractère spécial ${char}`;
      }
    }).join(', ');
    
    speech.text = spokenText;
    speech.lang = 'fr-FR';
    speech.rate = 0.9; // Légèrement plus lent pour une meilleure compréhension
    
    window.speechSynthesis.speak(speech);
  } else {
    alert('Désolé, la synthèse vocale n\'est pas supportée par votre navigateur.');
  }
};

// Valider le formulaire
const validateForm = () => {
  let isValid = true;
  
  // Validation du nom
  if (!formData.name.trim()) {
    formErrors.name = 'Le nom est requis';
    isValid = false;
  } else {
    formErrors.name = '';
  }
  
  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    formErrors.email = 'L\'email est requis';
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    formErrors.email = 'Veuillez entrer une adresse email valide';
    isValid = false;
  } else {
    formErrors.email = '';
  }
  
  // Validation du message
  if (!formData.message.trim()) {
    formErrors.message = 'Le message est requis';
    isValid = false;
  } else {
    formErrors.message = '';
  }
  
  // Vérification du verrouillage
  if (isLocked.value) {
    const currentTime = new Date().getTime();
    if (currentTime < lockoutEndTime.value) {
      const remainingTimeMinutes = Math.ceil((lockoutEndTime.value - currentTime) / 60000);
      formErrors.captcha = `Trop de tentatives incorrectes. Veuillez réessayer dans ${remainingTimeMinutes} minute(s).`;
      isValid = false;
    } else {
      // Déverrouillage après expiration du délai
      isLocked.value = false;
      captchaAttempts.value = 0;
      refreshCaptcha();
    }
  }
  
  // Validation du captcha si non verrouillé
  // Valider uniquement la présence d'un captcha côté client
  if (!isLocked.value) {
    if (!captchaInput.value) {
      formErrors.captcha = 'Veuillez entrer le code de sécurité';
      isValid = false;
    } else {
      // Ne pas valider le captcha côté client, laissez le serveur s'en charger
      formErrors.captcha = '';
    }
  }
  
  return isValid;
};

// Soumission du formulaire
const handleSubmit = async () => {
  // Réinitialiser le statut de soumission
  formSubmissionStatus.value = '';
  
  // Vérifier si le formulaire est verrouillé
  if (isLocked.value) {
    const currentTime = new Date().getTime();
    if (currentTime < lockoutEndTime.value) {
      const remainingTimeMinutes = Math.ceil((lockoutEndTime.value - currentTime) / 60000);
      formSubmissionStatus.value = `Formulaire temporairement bloqué. Veuillez réessayer dans ${remainingTimeMinutes} minute(s).`;
      return;
    } else {
      isLocked.value = false;
      captchaAttempts.value = 0;
    }
  }
  
  // Vérifier le délai minimal entre génération et soumission
  const captchaGeneratedTime = parseInt(localStorage.getItem('captchaGeneratedTime') || '0');
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - captchaGeneratedTime;
  
  // Si moins de 2 secondes se sont écoulées depuis la génération du captcha,
  // c'est probablement un bot qui remplit le formulaire trop rapidement
  if (captchaGeneratedTime > 0 && elapsedTime < 2000) {
    // Augmente discrètement le compteur d'échecs sans alerter l'utilisateur
    captchaAttempts.value += 1;
    
    // Vérifie si le nombre maximum de tentatives est atteint
    if (captchaAttempts.value >= maxCaptchaAttempts) {
      isLocked.value = true;
      lockoutEndTime.value = currentTime + (15 * 60000); // 15 minutes de verrouillage
      formSubmissionStatus.value = 'Une erreur est survenue. Veuillez réessayer plus tard.';
      return;
    }
    
    // Génère un nouveau captcha et demande à l'utilisateur de réessayer
    refreshCaptcha();
    formSubmissionStatus.value = 'Veuillez vérifier le code de sécurité et réessayer.';
    return;
  }
  
  // Valider le formulaire
  if (!validateForm()) {
    return;
  }
  
  try {
    formSubmissionStatus.value = 'Envoi en cours...';
    
    // Vérification du captcha côté serveur d'abord
    const captchaResponse = await fetch(`${apiBaseUrl}/verify-captcha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important pour les cookies de session
      body: JSON.stringify({ captcha: captchaInput.value })
    });
    
    // Traitement de la réponse avec gestion des erreurs améliorée
    let captchaData;
    try {
      captchaData = await captchaResponse.json();
    } catch (jsonError) {
      console.error('Erreur lors du parsing JSON:', jsonError);
      formSubmissionStatus.value = 'Erreur de communication avec le serveur. Vérifiez que le backend est en cours d\'exécution.';
      return;
    }
    
    // Si la vérification du captcha échoue
    if (!captchaResponse.ok) {
      captchaAttempts.value++; // Incrémenter le compteur local
      
      // Verrouillage après trop de tentatives
      if (captchaAttempts.value >= maxCaptchaAttempts) {
        isLocked.value = true;
        lockoutEndTime.value = new Date().getTime() + (15 * 60000); // 15 minutes de verrouillage
        formErrors.captcha = 'Trop de tentatives incorrectes. Veuillez réessayer dans 15 minutes.';
      }
      
      formSubmissionStatus.value = captchaData.message || 'Erreur de vérification du captcha.';
      if (captchaData.attemptsLeft) {
        formSubmissionStatus.value += ` (${captchaData.attemptsLeft} tentative(s) restante(s))`;
      }
      
      // Générer un nouveau captcha après échec
      refreshCaptcha();
      return;
    }
    
    // Si la vérification du captcha réussit, soumettre le formulaire
    const requestBody = {
      ...formData,
      formToken: captchaData.formToken // Token obtenu de la vérification du captcha
    };
    
    const response = await fetch(`${apiBaseUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important pour les cookies de session
      body: JSON.stringify(requestBody)
    });
    
    // Traitement de la réponse avec gestion des erreurs améliorée
    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error('Erreur lors du parsing JSON:', jsonError);
      formSubmissionStatus.value = 'Erreur de communication avec le serveur.';
      return;
    }
    
    if (response.ok) {
      formSubmissionStatus.value = 'Message envoyé avec succès!';
      // Réinitialiser le formulaire
      resetForm();
    } else {
      formSubmissionStatus.value = responseData.message || 'Erreur lors de l\'envoi du message.';
    }
  } catch (error) {
    console.error('Erreur:', error);
    formSubmissionStatus.value = 'Erreur de connexion au serveur. Vérifiez que le backend est en cours d\'exécution.';
  }
};

// Réinitialiser le formulaire
const resetForm = () => {
  formData.name = '';
  formData.email = '';
  formData.message = '';
  captchaInput.value = '';
  refreshCaptcha();
  
  // Réinitialiser les erreurs
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = '';
  });
  
  // Réinitialiser les compteurs de sécurité en cas de succès
  captchaAttempts.value = 0;
};

// Obtenir le jeton CSRF du meta tag (à mettre en place dans votre layout)
const getCSRFToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]');
  return token ? token.getAttribute('content') : '';
};

// Initialiser le captcha et la sécurité au chargement
onMounted(async () => {
  // Vérifier s'il y a un verrouillage en cours dans le localStorage
  const storedLockoutTime = localStorage.getItem('captchaLockoutEndTime');
  
  if (storedLockoutTime) {
    const lockoutTime = parseInt(storedLockoutTime);
    const currentTime = new Date().getTime();
    
    if (currentTime < lockoutTime) {
      // Rétablir l'état de verrouillage
      isLocked.value = true;
      lockoutEndTime.value = lockoutTime;
    } else {
      // Nettoyer le localStorage si le verrouillage a expiré
      localStorage.removeItem('captchaLockoutEndTime');
    }
  }
  
  // Récupérer le nombre de tentatives précédent
  const storedAttempts = localStorage.getItem('captchaAttempts');
  if (storedAttempts) {
    captchaAttempts.value = parseInt(storedAttempts);
  }
  
  // Observer les changements de verrouillage pour les persister
  watch(isLocked, (newValue) => {
    if (newValue) {
      localStorage.setItem('captchaLockoutEndTime', lockoutEndTime.value.toString());
    } else {
      localStorage.removeItem('captchaLockoutEndTime');
    }
  });
  
  // Observer les changements de nombre de tentatives pour les persister
  watch(captchaAttempts, (newValue) => {
    localStorage.setItem('captchaAttempts', newValue.toString());
  });
  
  // Générer et synchroniser le captcha initial
  await refreshCaptcha();
});
</script>

<style scoped>
.contact-container {
  min-height: 100vh;
  background-color: #FEFCFB;
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.contact-card {
  background-color: #FFD9DA;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

h1 {
  color: #89023E;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Shrikhand', cursive;
}

.contact-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

label {
  color: #30343F;
  font-weight: bold;
}

input, textarea {
  padding: 0.5rem;
  border: 1px solid #30343F;
  border-radius: 5px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: 2px solid #EA638C;
  border-color: #EA638C;
}

button {
  background-color: #89023E;
  color: #FEFCFB;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #EA638C;
}

button:focus {
  outline: 2px solid #30343F;
  outline-offset: 2px;
}

/* Accessibilité: focus visible */
input:focus-visible, 
textarea:focus-visible,
button:focus-visible {
  outline: 3px solid #30343F;
  outline-offset: 2px;
}

/* Style d'erreur */
.error-message {
  color: #D8000C;
  font-size: 0.9rem;
  font-weight: bold;
}

input.error, textarea.error {
  border-color: #D8000C;
}

/* Captcha */
.captcha-container {
  margin-top: 1rem;
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.captcha-image {
  background-color: #f0f0f0;
  padding: 0.75rem;
  border-radius: 5px;
  font-family: monospace;
  font-size: 1.2rem;
  letter-spacing: 3px;
  font-weight: bold;
  color: #333;
  user-select: none;
  text-transform: none; /* Modifié pour conserver la casse et voir les minuscules */
  border: 1px solid #ccc;
}

.refresh-captcha {
  background-color: #30343F;
  color: white;
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-icon {
  font-size: 1.2rem;
}

.captcha-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.captcha-audio {
  margin-top: 0.5rem;
}

.audio-button {
  background-color: transparent;
  color: #89023E;
  border: 1px solid #89023E;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
}

.audio-button:hover {
  background-color: #f0f0f0;
}

.captcha-attempts {
  color: #89023E;
  font-size: 0.9rem;
  font-weight: bold;
}

.captcha-locked {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
  border: 1px solid #f5c6cb;
}

.lock-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.attempts-info {
  font-size: 0.85rem;
  color: #89023E;
}

/* Statut de soumission */
.submission-status {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}

/* Pour les écrans de lecture */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* Media queries pour la responsivité */
@media (max-width: 768px) {
  .contact-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .contact-container {
    padding: 1rem;
  }
  
  .contact-card {
    padding: 1rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
}

/* Contraste suffisant pour l'accessibilité */
@media (prefers-contrast: more) {
  .contact-card {
    background-color: white;
    border: 2px solid black;
  }
  
  h1, label {
    color: black;
  }
  
  input, textarea {
    border: 2px solid black;
  }
  
  button {
    background-color: black;
    color: white;
  }
}
</style>