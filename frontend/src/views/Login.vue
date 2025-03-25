<!-- 


<template>
  <div class="login-page" role="main" aria-labelledby="login-title">
    <div class="login-container">
      <h1 id="login-title" class="title">Connexion</h1>
      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email"
            v-model="email"
            required
            placeholder="Entrez votre email"
            class="input-field"
            :aria-invalid="!!emailError"
          >
          <span v-if="emailError" class="error" role="alert">{{ emailError }}</span>
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="password-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              placeholder="Entrez votre mot de passe"
              class="input-field"
              :aria-invalid="!!passwordError"
            >
            <button 
              type="button"
              class="toggle-password"
              @click="togglePassword"
              aria-label="Afficher/Masquer le mot de passe"
            >
              <span class="eye-icon">{{ showPassword ? '🙈' : '👁️' }}</span>
            </button>
          </div>
          <span v-if="passwordError" class="error" role="alert">{{ passwordError }}</span>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>

        <p class="redirect-text">
          Pas encore inscrit ? 
          <router-link to="/signup" class="redirect-link">S'inscrire</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import api from '@/axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const isLoading = ref(false);
    const showPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    
    const handleLogin = async () => {
  try {
    emailError.value = '';
    passwordError.value = '';
    isLoading.value = true;
    
    const response = await api.post('/users/login', {
      email: email.value,
      password: password.value
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      await Swal.fire({
        icon: 'success',
        title: 'Connexion réussie!',
        text: 'Vous allez être redirigé vers votre tableau de bord',
        timer: 1500,
        showConfirmButton: false
      });

      // // Nous ajoutons une courte pause avant la redirection
      // setTimeout(() => {
      //   location.href = '/dashboard';
      // }, 100);
      if (response.data.user.role === 'admin') {
        location.href = '/admin';
      } else {
        location.href = '/dashboard';
      }
    }
  } catch (error) {
    console.error('Erreur de connexion :', error);
    await Swal.fire({
      icon: 'error',
      title: 'Erreur de connexion',
      text: error.response?.data?.message || 'Email ou mot de passe incorrect'
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
      handleLogin,
      togglePassword
    };
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'LifeLogo';
  src: url('@/assets/fonts/LifeLogo.ttf') format('truetype');
}

.login-page {
  min-height: 100vh;
  background-color: #1B2021;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background-color: #30343F;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  color: #FFD9DA;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  font-family: 'LifeLogo', sans-serif;
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

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #FFD9DA;
  cursor: pointer;
  padding: 5px;
  font-size: 1.2rem;
}

.eye-icon {
  font-size: 1.2rem;
}

label {
  color: #FFD9DA;
  font-size: 0.9rem;
  font-family: 'LifeLogo', sans-serif;
}

.input-field {
  padding: 0.75rem;
  border: 2px solid #EA638C;
  border-radius: 4px;
  background-color: #30343F;
  color: #FEFCFB;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #89023E;
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
  color: #FEFCFB;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s;
  font-family: 'LifeLogo', sans-serif;
}

.submit-btn:hover {
  background-color: #EA638C;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.redirect-text {
  text-align: center;
  color: #FFD9DA;
  margin-top: 1rem;
  font-size: 0.9rem;
  font-family: 'LifeLogo', sans-serif;
}

.redirect-link {
  color: #EA638C;
  text-decoration: none;
  font-weight: 600;
}

.redirect-link:hover {
  text-decoration: underline;
}
</style> -->






<template>
  <main class="login-page" aria-labelledby="login-title">
    <div class="login-container">
      <h1 id="login-title" class="title">Connexion</h1>
      
      <!-- Message d'erreur global -->
      <div v-if="generalError" class="error-message" role="alert">
        {{ generalError }}
      </div>
      
      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email"
            v-model="email"
            required
            placeholder="Entrez votre email"
            class="input-field"
            :aria-invalid="!!emailError"
            aria-describedby="email-error"
          >
          <div 
            v-if="emailError" 
            id="email-error" 
            class="error" 
            role="alert"
          >
            {{ emailError }}
          </div>
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="password-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              placeholder="Entrez votre mot de passe"
              class="input-field"
              :aria-invalid="!!passwordError"
              aria-describedby="password-error"
            >
            <button 
              type="button"
              class="toggle-password"
              @click="togglePassword"
              aria-label="Afficher ou masquer le mot de passe"
            >
              <span class="eye-icon" aria-hidden="true">{{ showPassword ? '🙈' : '👁️' }}</span>
            </button>
          </div>
          <div 
            v-if="passwordError" 
            id="password-error" 
            class="error" 
            role="alert"
          >
            {{ passwordError }}
          </div>
        </div>

        <button 
          type="submit" 
          class="submit-btn" 
          :disabled="isLoading"
          aria-busy="isLoading"
        >
          {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
        </button>

        <p class="redirect-text">
          Pas encore inscrit ? 
          <router-link to="/signup" class="redirect-link">S'inscrire</router-link>
        </p>
      </form>
    </div>
  </main>
</template>

<script>
import { ref } from 'vue';
import api from '@/axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const generalError = ref('');
    const isLoading = ref(false);
    const showPassword = ref(false);

    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    
    const handleLogin = async () => {
      try {
        // Réinitialiser les erreurs
        emailError.value = '';
        passwordError.value = '';
        generalError.value = '';
        isLoading.value = true;
        
        // Validation côté client
        if (!email.value.trim()) {
          emailError.value = 'L\'email est requis';
          isLoading.value = false;
          return;
        }
        
        if (!password.value) {
          passwordError.value = 'Le mot de passe est requis';
          isLoading.value = false;
          return;
        }
        
        const response = await api.post('/users/login', {
          email: email.value,
          password: password.value
        });

        if (response.data.token) {
          // Stocker exactement le token reçu de l'API
          localStorage.setItem('token', response.data.token);
          
          await Swal.fire({
            icon: 'success',
            title: 'Connexion réussie!',
            text: 'Vous allez être redirigé vers votre tableau de bord',
            timer: 1500,
            showConfirmButton: false
          });

          // Redirection vers le tableau de bord
          location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Erreur de connexion :', error);
        
        // Supprimer tout token existant en cas d'échec de connexion
        localStorage.removeItem('token');
        
        // Gestion plus précise des erreurs
        if (error.response?.status === 401) {
          generalError.value = 'Email ou mot de passe incorrect';
        } else if (error.response?.data?.message) {
          generalError.value = error.response.data.message;
        } else {
          generalError.value = 'Une erreur est survenue lors de la connexion';
        }
        
        await Swal.fire({
          icon: 'error',
          title: 'Erreur de connexion',
          text: error.response?.data?.message || 'Email ou mot de passe incorrect'
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
      generalError,
      isLoading,
      showPassword,
      handleLogin,
      togglePassword
    };
  }
};
</script>

<style scoped>
@font-face {
  font-family: 'LifeLogo';
  src: url('@/assets/fonts/LifeLogo.ttf') format('truetype');
  font-display: swap; /* Amélioration des performances */
}

.login-page {
  min-height: 100vh;
  background-color: #1B2021;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background-color: #30343F;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  color: #FFD9DA;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
  font-family: 'LifeLogo', sans-serif;
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

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #FFD9DA;
  cursor: pointer;
  padding: 5px;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.toggle-password:hover, 
.toggle-password:focus {
  color: #EA638C;
  outline: none;
}

.toggle-password:focus-visible {
  outline: 2px solid #EA638C;
  border-radius: 4px;
}

.eye-icon {
  font-size: 1.2rem;
}

label {
  color: #FFD9DA;
  font-size: 0.9rem;
  font-family: 'LifeLogo', sans-serif;
}

.input-field {
  padding: 0.75rem;
  border: 2px solid #EA638C;
  border-radius: 4px;
  background-color: #30343F;
  color: #FEFCFB;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #89023E;
  box-shadow: 0 0 0 2px rgba(137, 2, 62, 0.4);
}

.input-field::placeholder {
  color: #FFD9DA;
  opacity: 0.7;
}

.error, .error-message {
  color: #EA638C;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  background-color: rgba(234, 99, 140, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 3px solid #EA638C;
}

.error-message {
  margin-bottom: 1rem;
}

.submit-btn {
  background-color: #89023E;
  color: #FEFCFB;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s, transform 0.2s;
  font-family: 'LifeLogo', sans-serif;
}

.submit-btn:hover:not(:disabled) {
  background-color: #EA638C;
  transform: translateY(-2px);
}

.submit-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(234, 99, 140, 0.5);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.redirect-text {
  text-align: center;
  color: #FFD9DA;
  margin-top: 1rem;
  font-size: 0.9rem;
  font-family: 'LifeLogo', sans-serif;
}

.redirect-link {
  color: #EA638C;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s, text-decoration 0.3s;
}

.redirect-link:hover, 
.redirect-link:focus {
  color: #FFD9DA;
  text-decoration: underline;
}

.redirect-link:focus-visible {
  outline: 2px solid #EA638C;
  border-radius: 2px;
}

/* Styles responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem;
  }
  
  .title {
    font-size: 1.75rem;
  }
  
  .input-field, .submit-btn {
    padding: 0.6rem;
  }
}

/* Accessibilité pour ceux qui préfèrent réduire les animations */
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
  
  .submit-btn:hover:not(:disabled) {
    transform: none;
  }
}
</style>