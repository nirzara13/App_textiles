# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).


#### Application de Gestion de Textiles "Un file & un style"

Une application web permettant de gérer et explorer différentes matières textiles, avec système d'authentification et gestion de favoris.

Ce projet a été développé avec l'assistance de Claude AI pour améliorer certaines parties du code et structurer la documentation technique.

#### Fonctionnalités

- Authentification utilisateur (inscription, connexion, déconnexion)
- Gestion de profil (affichage, modification, suppression)
- Exploration des matières textiles par catégories (synthétiques, naturelles, techniques)
- Système de favoris pour sauvegarder les matières préférées
- Interface responsive et accessible

#### Accessibles aux visiteurs (sans connexion)

Exploration du catalogue complet de matières textiles organisées par catégories:

Fibres synthétiques (nylon, polyester, etc.)
Fibres naturelles/animales (soie, cachemire, etc.)


Consultation détaillée de chaque textile (description, composition, utilisations)
Accès aux pages d'information légale (mentions légales, politique de confidentialité, conditions d'utilisation)
Création de compte et connexion


#### Réservées aux utilisateurs connectés

-Réservées aux utilisateurs connectés

-Accès à un tableau de bord personnalisé
-Gestion du compte utilisateur (modification d'email, changement de mot de passe, suppression de compte)
-Ajout de textiles à la liste de favoris avec possibilité d'enregistrer:

La fréquence d'utilisation personnelle
Le contexte d'utilisation (exemple: "Fête", "Quotidien", etc.)
Des notes personnelles sur le textile

Consultation, modification et suppression des textiles favoris


#### Technologies utilisées

- **Frontend**: Vue.js, Bootstrap, FontAwesome
- **Backend**: Node.js, Express
- **Base de données**: MySQL
- **ORM**: Sequelize
- **Sécurité**: bcrypt, JWT

#### Installation et démarrage

# Prérequis

- Node.js (version 14 ou supérieure)
- Base de données MySQL ou PostgreSQL
- npm (gestionnaire de paquets)

# Étapes d'installation

Téléchargez le code source

1-git clone [URL_DU_REPO]
cd mon-app-textiles

2-Installez toutes les dépendances avec ## npm install


## Configuer le fichier d'environnement .env 

## Démarrez l'application
Exécuter la commande suivante à la racine du projet : npm run dev 

Ouvrir un nouveau terminal dans VS Code, se placer dans le dossier backend et exécuter : node server.js


# Dépendances du projet
Interface utilisateur (Frontend)

# Framework Vue.js et gestion de routes
npm install vue@3.5.13 vue-router@4.5.0 pinia@2.3.1

# Composants d'interface et styles
npm install bootstrap@5.3.3 @popperjs/core@2.11.8 sweetalert2@11.17.2
npm install @fortawesome/fontawesome-free@6.7.2 font-awesome@4.7.0

# Serveur et API (Backend)
# Serveur Express et middlewares
npm install express@4.21.2 cors@2.8.5 body-parser@1.20.3 
npm install helmet@8.0.0 morgan@1.10.0 express-validator@7.2.1
npm install express-rate-limit@7.5.0 cookie-parser@1.4.7 express-session@1.18.1

# Gestion de base de données
npm install sequelize@6.37.5 mysql2@3.14.0 pg@8.13.1

# Sécurité et authentification
npm install bcrypt@5.1.1 bcryptjs@3.0.2 jsonwebtoken@9.0.2

# Outils divers
npm install dotenv@16.4.7 nodemailer@6.10.0 winston@3.17.0
npm install sanitize-html@2.15.0 path@0.12.7 process@0.11.10



# Environnement de développement
npm install --save-dev vite@6.0.4 @vitejs/plugin-vue@5.2.1 concurrently@9.1.2

# Tests et validation
npm install --save-dev vitest@3.0.9 jest@29.7.0 jsdom@26.0.0
npm install --save-dev @testing-library/jest-dom@6.6.3 @vue/test-utils@2.4.0-alpha.2
npm install --save-dev @vue/vue3-jest@29.2.6 babel-jest@26.6.3 @babel/preset-env@7.26.9


# Architecture technique
L'application est construite selon le modèle MVC (Modèle-Vue-Contrôleur):

- Vue (Frontend): Vue.js 3 gère l'interface utilisateur avec une approche par composants
- Contrôleur (Backend): Express.js traite les requêtes et coordonne les opérations
- Modèle (Base de données): Sequelize ORM interagit avec MySQL/PostgreSQL

# Mesures de sécurité

Stockage sécurisé des mots de passe avec hachage bcrypt
Protection contre les injections SQL grâce à l'ORM Sequelize
Validation des données entrantes via express-validator
Sécurité contre les attaques web courantes (CSRF, XSS) avec helmet

