// src/utils/sessionTimeout.js
import Swal from 'sweetalert2';
import router from '../router';

class SessionTimeoutManager {
  constructor(options = {}) {
    // Configuration par défaut
    this.options = {
      timeout: options.timeout || 30 * 60 * 1000, // 30 minutes par défaut
      countdown: options.countdown || 60 * 1000, // Alerte 1 minute avant
      onTimeout: options.onTimeout || this.defaultLogout,
      keepAliveUrl: options.keepAliveUrl || 'http://localhost:3000/api/users/keepalive',
      keepAliveInterval: options.keepAliveInterval || 5 * 60 * 1000, // 5 minutes
      events: options.events || ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'],
      authStore: options.authStore || null, // Store Pinia d'authentification
    };

    // État interne
    this.timeoutId = null;
    this.countdownId = null;
    this.keepAliveId = null;
    this.lastActivity = Date.now();
    this.isCountingDown = false;
  }

  // Initialiser le gestionnaire de timeout
  init() {
    this._addActivityListeners();
    this._startTimer();
    this._startKeepAlive();
    
    console.log('Gestionnaire de timeout de session initialisé');
    return this;
  }

  // Réinitialiser le timer
  resetTimer() {
    this.lastActivity = Date.now();
    
    // Si un compte à rebours est en cours, l'annuler
    if (this.isCountingDown) {
      this._cancelCountdown();
    }
    
    // Redémarrer le timer
    this._clearTimer();
    this._startTimer();
  }

  // Arrêter complètement le gestionnaire
  stop() {
    this._removeActivityListeners();
    this._clearTimer();
    this._cancelCountdown();
    this._stopKeepAlive();
  }

  // Méthode par défaut de déconnexion
  async defaultLogout() {
    try {
      // Utiliser le store Pinia pour la déconnexion si disponible
      if (this.options.authStore && typeof this.options.authStore.logout === 'function') {
        this.options.authStore.logout();
      } else {
        // Fallback si le store n'est pas disponible
        localStorage.removeItem('token');
        sessionStorage.clear();
      }

      // Rediriger vers la page de connexion
      if (router && router.push) {
        router.push('/login?expired=true');
      } else {
        window.location.href = '/login?expired=true';
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // En cas d'erreur, forcer la redirection
      window.location.href = '/login?expired=true';
    }
  }

  // Méthodes privées
  _addActivityListeners() {
    this.activityHandler = () => this.resetTimer();
    
    this.options.events.forEach(event => {
      window.addEventListener(event, this.activityHandler);
    });
  }

  _removeActivityListeners() {
    if (this.activityHandler) {
      this.options.events.forEach(event => {
        window.removeEventListener(event, this.activityHandler);
      });
    }
  }

  _startTimer() {
    this.timeoutId = setTimeout(() => {
      const inactiveTime = Date.now() - this.lastActivity;
      
      if (inactiveTime >= this.options.timeout - this.options.countdown) {
        this._startCountdown();
      } else {
        this._startTimer();
      }
    }, 1000); // Vérifier toutes les secondes
  }

  _clearTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  _startCountdown() {
    if (this.isCountingDown) return;
    
    this.isCountingDown = true;
    const remainingSeconds = Math.ceil(this.options.countdown / 1000);
    
    Swal.fire({
      title: 'Votre session va expirer',
      html: `Vous serez déconnecté dans <b>${remainingSeconds}</b> secondes pour des raisons de sécurité.<br>Souhaitez-vous rester connecté?`,
      icon: 'warning',
      timer: this.options.countdown,
      timerProgressBar: true,
      confirmButtonText: 'Rester connecté',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    }).then((result) => {
      this.isCountingDown = false;
      
      if (result.isConfirmed) {
        // L'utilisateur a cliqué sur "Rester connecté"
        this.resetTimer();
      } else if (result.dismiss === Swal.DismissReason.timer) {
        // Le timer est arrivé à expiration
        this.options.onTimeout.call(this);
      }
    });
  }

  _cancelCountdown() {
    this.isCountingDown = false;
    Swal.close();
  }

  _startKeepAlive() {
    if (this.options.keepAliveUrl) {
      this.keepAliveId = setInterval(async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            this.stop();
            return;
          }
          
          // Utilisez un timestamp pour éviter la mise en cache
          const timestamp = new Date().getTime();
          const response = await fetch(`${this.options.keepAliveUrl}?t=${timestamp}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          
          // Si la réponse est un succès, tout va bien
          if (response.ok) {
            console.log('Session prolongée avec succès');
          } else {
            // Sinon, loggez l'erreur mais continuez à fonctionner
            console.warn('Erreur keepAlive - continuez à utiliser le timeout local');
          }
        } catch (error) {
          // Même en cas d'erreur, on ne veut pas interrompre l'expérience utilisateur
          console.warn('Erreur keepAlive (réseau):', error);
        }
      }, this.options.keepAliveInterval);
    }
  }

  _stopKeepAlive() {
    if (this.keepAliveId) {
      clearInterval(this.keepAliveId);
      this.keepAliveId = null;
    }
  }
}

export default SessionTimeoutManager;