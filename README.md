# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).


# Documentation des Tests

# Application de Gestion de Textiles

Une application web permettant de gérer et explorer différentes matières textiles, avec système d'authentification et gestion de favoris.

## Fonctionnalités

- Authentification utilisateur (inscription, connexion, déconnexion)
- Gestion de profil (affichage, modification, suppression)
- Exploration des matières textiles par catégories (synthétiques, naturelles, techniques)
- Système de favoris pour sauvegarder les matières préférées
- Interface responsive et accessible

## Technologies utilisées

- **Frontend**: Vue.js, Bootstrap, FontAwesome
- **Backend**: Node.js, Express
- **Base de données**: MySQL
- **ORM**: Sequelize
- **Sécurité**: bcrypt, JWT

## Structure de la base de données

L'application utilise une base de données MySQL avec les tables suivantes:
- `users`: stocke les informations des utilisateurs
- `textiles`: contient les matières textiles
- `categories`: catégories de matières textiles
- `favorites`: association many-to-many entre utilisateurs et textiles

## Installation et démarrage

### Prérequis

- Node.js
- MySQL

### Installation

