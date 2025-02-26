// import express from 'express';
// import User from '../models/user.js';
// import bcrypt from 'bcrypt';

// const router = express.Router();

// router.post('/signup', async (req, res) => {
//     const { email, password } = req.body;
//     console.log('Requête reçue avec email:', email, 'et mot de passe:', password);
  
//     try {
//       // Vérification si l'utilisateur existe déjà
//       const existingUser = await User.findOne({ where: { email } });
//       console.log('Utilisateur existant:', existingUser);
  
//       if (existingUser) {
//         return res.status(400).json({ message: 'Cet email est déjà utilisé' });
//       }
  
//       // Hashage du mot de passe
//       const hashedPassword = await bcrypt.hash(password, 10);
//       console.log('Mot de passe hashé:', hashedPassword);
  
//       // Création de l'utilisateur
//       const newUser = await User.create({
//         email,
//         mot_de_passe: hashedPassword,
//       });
//       console.log('Utilisateur créé:', newUser);
  
//       return res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
//     } catch (error) {
//       console.error('Erreur lors de l\'inscription :', error);
//       return res.status(500).json({ message: 'Erreur lors de l\'inscription', erreur: error.message });
//     }
//   });
  
// export default router;


// routes/userRoutes.js
// import express from 'express';
// import { signup, login, getProfile, updateProfile, deleteProfile, getFavorites, addFavorite, removeFavorite } from '../controllers/userController.js';
// import passwordValidator from '../middleware/passwordValidator.js';
// import { authMiddleware } from '../middleware/auth.js';

// const router = express.Router();

// // Routes publiques
// router.post('/signup', passwordValidator, signup);
// router.post('/login', login);

// // Routes protégées
// router.get('/profile', authMiddleware, getProfile);
// router.put('/profile', authMiddleware, updateProfile);
// router.delete('/profile', authMiddleware, deleteProfile);
// router.get('/favorites', authMiddleware, getFavorites);
// router.post('/favorites/:textileId', authMiddleware, addFavorite);
// router.delete('/favorites/:textileId', authMiddleware, removeFavorite);

// export default router;


// routes/userRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import AuthController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

// routes/userRoutes.js
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

// Routes pour les favoris
router.get('/favorites', authMiddleware, getFavorites);
router.post('/favorites/:textileId', authMiddleware, addFavorite);
router.delete('/favorites/:textileId', authMiddleware, removeFavorite);
export default router;