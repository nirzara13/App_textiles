<template>
  <div id="home" class="home-container">
    <!-- Contenu de la page (carrousel, etc.) -->

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <!-- Colonne 1 : Logo -->
        <div class="footer-column logo">
          <img src="@/assets/app-textile_Logo.png" alt="Logo" class="footer-logo" />
        </div>

        <!-- Colonne 2 : Liens utiles -->
        <div class="footer-column info">
          <h3>Liens utiles</h3>
          <p><a href="/mentions-legales">Mentions Légales</a></p>
          <p><a href="/politique-confidentialite">Politique de Confidentialité</a></p>
          <p><a href="/conditions-utilisation">Conditions d'Utilisation</a></p>
        </div>

        <!-- Colonne 3 : Réseaux sociaux -->
        <div class="footer-column social">
          <h3>Suivez-nous</h3>
          <div class="social-icons">
            <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Importer Font Awesome pour les icônes sociales
import 'font-awesome/css/font-awesome.min.css';
</script>

<style scoped>
/* Style du Footer */
.footer {
  background-color: #30343f;
  color: #fff;
  padding: 40px 0;
  position: relative;
  animation: fadeIn 2s ease-in-out;
  font-family: 'Shrikhand', cursive; /* Typographie globale pour le footer */
}

.footer-container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* Trois colonnes : logo, informations, réseaux sociaux */
  gap: 40px;
  justify-items: center;
}

.footer-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-logo {
  width: 200px; /* Taille du logo */
  height: auto;
  transition: transform 0.3s ease;
}

.footer-logo:hover {
  transform: scale(1.1); /* Animation d'agrandissement du logo */
}

.footer-column h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-transform: uppercase;
  color: #eb8eb9; /* Couleur rouge pour le titre */
}

.footer-column p {
  font-size: 1rem;
  text-align: center;
}

.footer-column a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-column a:hover {
  color: #cc8eb0; /* Couleur rouge au survol */
}

.social-icons {
  display: flex;
  gap: 20px;
}

.social-icon {
  font-size: 1.5rem;
  color: #fff;
  transition: color 0.3s ease;
}

.social-icon:hover {
  color: #e74c3c; /* Couleur rouge au survol */
}

/* Animation de fade-in du footer */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
