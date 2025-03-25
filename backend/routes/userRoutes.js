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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/signup', AuthController.signup);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 */
router.post('/login', AuthController.login);

// Routes protégées
router.use(authMiddleware);

router.get('/profile', AuthController.getProfile);
router.put('/profile', AuthController.updateProfile);
router.delete('/profile', AuthController.deleteAccount);

router.get('/', getProfileDetails);
router.put('/', updateProfileDetails);

// Routes pour les favoris
router.get('/favorites', authMiddleware, getFavorites);
router.post('/favorites/:textileId', authMiddleware, addFavorite);
router.delete('/favorites/:textileId', authMiddleware, removeFavorite);

export default router;