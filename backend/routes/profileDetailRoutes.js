// routes/profileRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import db from '../models/index.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Récupérer le profil détaillé
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    
    // Rechercher un profil existant ou en créer un nouveau
    let profile = await db.Profile.findOne({
      where: { user_id: userId }
    });
    
    if (!profile) {
      // Créer un profil vide si aucun n'existe
      profile = await db.Profile.create({
        user_id: userId,
        display_name: '',
        bio: ''
      });
    }
    
    res.json({
      success: true,
      profile: profile
    });
  } catch (error) {
    console.error('Erreur profil détaillé:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil détaillé'
    });
  }
});

// Mettre à jour le profil détaillé
router.put('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { display_name, bio } = req.body;
    
    // Rechercher le profil existant ou en créer un nouveau
    let profile = await db.Profile.findOne({
      where: { user_id: userId }
    });
    
    if (profile) {
      // Mettre à jour un profil existant
      await profile.update({
        display_name,
        bio
      });
    } else {
      // Créer un nouveau profil
      profile = await db.Profile.create({
        user_id: userId,
        display_name,
        bio
      });
    }
    
    res.json({
      success: true,
      message: 'Profil détaillé mis à jour avec succès',
      profile: profile
    });
  } catch (error) {
    console.error('Erreur mise à jour profil détaillé:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil détaillé'
    });
  }
});

export default router;