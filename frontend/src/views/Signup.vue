<template>
  <div class="signup-page" role="main" aria-labelledby="signup-title">
    <div class="signup-container">
      <h1 id="signup-title" class="title" tabindex="0">Inscription</h1>
      <form @submit.prevent="handleSubmit" class="form" novalidate>
        <div class="form-group">
          <label for="email" id="email-label">Email</label>
          <input 
            type="email" 
            id="email"
            v-model="email"
            required
            placeholder="Entrez votre email"
            class="input-field"
            aria-required="true"
            aria-describedby="email-error"
            :aria-invalid="!!emailError"
            @input="validateEmailOnInput"
          >
          <span 
            v-if="emailError" 
            class="error" 
            id="email-error" 
            role="alert"
          >{{ emailError }}</span>
        </div>

        <div class="form-group">
          <label for="password" id="password-label">Mot de passe</label>
          <div class="password-input-group">
            <input 
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              placeholder="Entrez votre mot de passe"
              class="input-field"
              aria-required="true"
              aria-describedby="password-requirements password-error"
              :aria-invalid="!!passwordError"
              @input="validatePasswordOnInput"
            >
            <button 
              type="button"
              class="toggle-password"
              @click="togglePassword"
              :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              :aria-pressed="showPassword"
            >
              <span aria-hidden="true">{{ showPassword ? '🙈' : '👁️' }}</span>
            </button>
          </div>
          <div 
            id="password-requirements" 
            class="requirements"
            role="note"
          >
            <p>Votre mot de passe doit contenir :</p>
            <ul>
              <li :class="{ valid: hasUpper }">Une majuscule</li>
              <li :class="{ valid: hasLower }">Une minuscule</li>
              <li :class="{ valid: hasNumber }">Un chiffre</li>
              <li :class="{ valid: hasSpecialChars }">Deux caractères spéciaux</li>
              <li :class="{ valid: isCorrectLength }">Entre 8 et 12 caractères</li>
            </ul>
          </div>
          <span 
            v-if="passwordError" 
            class="error" 
            id="password-error"
            role="alert"
          >{{ passwordError }}</span>
        </div>

        <button 
          type="submit" 
          class="submit-btn" 
          :disabled="isLoading || !isFormValid"
          aria-busy="isLoading"
        >
          {{ isLoading ? 'Inscription en cours...' : "S'inscrire" }}
        </button>

        <p class="redirect-text">
          Déjà inscrit ? 
          <router-link to="/login" class="redirect-link">Se connecter</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'Signup',
  setup() {
    const router = useRouter();
    
    const email = ref('');
    const password = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const isLoading = ref(false);
    const showPassword = ref(false);

    // Validation du mot de passe
    const hasUpper = computed(() => /[A-Z]/.test(password.value));
    const hasLower = computed(() => /[a-z]/.test(password.value));
    const hasNumber = computed(() => /\d/.test(password.value));
    const hasSpecialChars = computed(() => 
      (password.value.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 2
    );
    const isCorrectLength = computed(() => 
      password.value.length >= 8 && password.value.length <= 12
    );

    const isFormValid = computed(() => {
      return validateEmail(email.value) && validatePassword(password.value).isValid;
    });

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const validateEmailOnInput = () => {
      if (!email.value) {
        emailError.value = 'L\'email est requis';
      } else if (!validateEmail(email.value)) {
        emailError.value = 'Format d\'email invalide';
      } else {
        emailError.value = '';
      }
    };

    const validatePassword = (password) => {
      if (!password) {
        return {
          isValid: false,
          message: 'Le mot de passe est requis'
        };
      }

      const requirements = [
        { met: isCorrectLength.value, message: 'entre 8 et 12 caractères' },
        { met: hasUpper.value, message: 'une majuscule' },
        { met: hasLower.value, message: 'une minuscule' },
        { met: hasNumber.value, message: 'un chiffre' },
        { met: hasSpecialChars.value, message: 'deux caractères spéciaux' }
      ];

      const unmetRequirements = requirements
        .filter(req => !req.met)
        .map(req => req.message);

      return {
        isValid: unmetRequirements.length === 0,
        message: unmetRequirements.length > 0 
          ? `Le mot de passe doit contenir : ${unmetRequirements.join(', ')}`
          : ''
      };
    };

    const validatePasswordOnInput = () => {
      const validation = validatePassword(password.value);
      passwordError.value = validation.message;
    };

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };

    const handleSubmit = async () => {
      try {
        validateEmailOnInput();
        validatePasswordOnInput();

        if (!isFormValid.value) {
          return;
        }

        isLoading.value = true;

        const response = await axios.post('http://localhost:3000/api/users/signup', {
          email: email.value,
          password: password.value
        });

        if (response.data.success) {
          await Swal.fire({
            title: 'Succès!',
            text: 'Votre compte a été créé avec succès',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          router.push('/login');
        }
      } // Dans Signup.vue, modifiez la partie catch pour afficher plus de détails:
catch (error) {
  console.error('Erreur lors de l\'inscription:', error);
  console.log('Détails de l\'erreur:', error.response?.data);
        
  const errorMessage = error.response?.data?.message || 
    'Une erreur est survenue lors de l\'inscription';
        
  await Swal.fire({
    title: 'Erreur',
    text: errorMessage,
    icon: 'error',
    confirmButtonText: 'OK'
  });

      } finally {
        isLoading.value = false;
      }
    };

    return {
      email,
      password,
      emailError,
      passwordError,
      isLoading,
      showPassword,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecialChars,
      isCorrectLength,
      isFormValid,
      handleSubmit,
      togglePassword,
      validateEmailOnInput,
      validatePasswordOnInput
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');

.signup-page {
  min-height: 100vh;
  background-color: #1B2021;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.signup-container {
  background-color: #30343F;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  font-family: 'Shrikhand', cursive;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #FFFFFF;
  font-size: 0.9rem;
  font-weight: 500;
}

.input-field {
  padding: 0.75rem;
  border: 2px solid #EA638C;
  border-radius: 4px;
  background-color: #30343F;
  color: #FFFFFF;
  transition: border-color 0.3s ease;
  width: 100%;
}

.input-field:focus {
  outline: none;
  border-color: #89023E;
  box-shadow: 0 0 0 3px rgba(137, 2, 62, 0.3);
}

.input-field::placeholder {
  color: #FFD9DA;
  opacity: 0.7;
}

.error {
  color: #EA638C;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.submit-btn {
  background-color: #89023E;
  color: #FFFFFF;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.submit-btn:not(:disabled):hover {
  background-color: #EA638C;
}

.submit-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.7;
}

.redirect-text {
  text-align: center;
  color: #FFD9DA;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.redirect-link {
  color: #EA638C;
  text-decoration: none;
  font-weight: 600;
}

.redirect-link:hover,
.redirect-link:focus {
  text-decoration: underline;
  outline: none;
}

.password-input-group {
  position: relative;
  display: flex;
  align-items: center;
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
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:focus {
  outline: 2px solid #89023E;
  border-radius: 4px;
}

.requirements {
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #FFD9DA;
}

.requirements p {
  margin: 0 0 8px 0;
}

.requirements ul {
  list-style: none;
  padding-left: 0;
  margin: 5px 0;
}

.requirements li {
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.requirements li::before {
  content: '❌';
}

.requirements li.valid {
  color: #4CAF50;
}

.requirements li.valid::before {
  content: '✅';
}

/* Focus styles for keyboard navigation */
:focus-visible {
  outline: 3px solid #89023E;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode support */
@media (forced-colors: active) {
  .input-field {
    border: 2px solid CanvasText;
  }
  
  .submit-btn {
    border: 2px solid ButtonText;
  }
}
</style>