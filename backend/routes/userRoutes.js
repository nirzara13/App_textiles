// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import db from '../models/index.js';
// import AuthController from '../controllers/authController.js';
// import { authMiddleware } from '../middleware/auth.js';
// import { getProfileDetails, updateProfileDetails } from '../controllers/userController.js';
// import { getFavorites, addFavorite, removeFavorite } from '../controllers/simpleFavoriteController.js';
// import rateLimit from 'express-rate-limit';

// // Créer un limiteur pour les routes de favoris
// const favoritesLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
//   standardHeaders: true, // Retourne les infos de limite dans les en-têtes standard
//   legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
//   message: {
//     success: false,
//     message: 'Trop de requêtes, veuillez réessayer plus tard'
//   }
// });

// const router = express.Router();

// /**
//  * @swagger
//  * /api/users/signup:
//  *   post:
//  *     summary: Inscription d'un nouvel utilisateur
//  *     tags: [Authentication]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               username:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               password:
//  *                 type: string
//  */
// router.post('/signup', AuthController.signup);

// /**
//  * @swagger
//  * /api/users/login:
//  *   post:
//  *     summary: Connexion d'un utilisateur
//  */
// router.post('/login', AuthController.login);

// // Routes protégées
// router.use(authMiddleware);

// router.get('/profile', AuthController.getProfile);
// router.put('/profile', AuthController.updateProfile);
// router.delete('/profile', AuthController.deleteAccount);

// router.get('/', getProfileDetails);
// router.put('/', updateProfileDetails);

// // Routes pour les favoris
// router.get('/favorites', authMiddleware, getFavorites);
// router.post('/favorites/:textileId', authMiddleware, addFavorite);
// router.delete('/favorites/:textileId', authMiddleware, removeFavorite);

// export default router;






//code du 06/04/2025 : 



import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import AuthController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { getProfileDetails, updateProfileDetails } from '../controllers/userController.js';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/simpleFavoriteController.js';
import rateLimit from 'express-rate-limit';

// Créer un limiteur pour les routes de favoris
const favoritesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
  standardHeaders: true, // Retourne les infos de limite dans les en-têtes standard
  legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard'
  }
});

const router = express.Router();

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de l'utilisateur
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe de l'utilisateur
 *     responses:
 *       201:
 *         description: Inscription réussie
 *       400:
 *         description: Données invalides ou email déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/signup', AuthController.signup);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', AuthController.login);

// Routes protégées - toutes les routes ci-dessous nécessitent une authentification
router.use(authMiddleware);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/profile', AuthController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Mettre à jour le profil de l'utilisateur
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 */
router.put('/profile', AuthController.updateProfile);

/**
 * @swagger
 * /api/users/profile:
 *   delete:
 *     summary: Supprimer le compte utilisateur
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compte supprimé avec succès
 */
router.delete('/profile', AuthController.deleteAccount);

// Routes pour les favoris avec limite de taux
/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Récupérer les favoris de l'utilisateur
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des favoris récupérée avec succès
 */
router.get('/favorites', favoritesLimiter, getFavorites);

/**
 * @swagger
 * /api/users/favorites/{textileId}:
 *   post:
 *     summary: Ajouter un textile aux favoris
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: textileId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favori ajouté avec succès
 */
router.post('/favorites/:textileId', favoritesLimiter, addFavorite);

/**
 * @swagger
 * /api/users/favorites/{textileId}:
 *   delete:
 *     summary: Retirer un textile des favoris
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: textileId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Favori retiré avec succès
 */
router.delete('/favorites/:textileId', favoritesLimiter, removeFavorite);

export default router;
